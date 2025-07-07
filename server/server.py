import mysql.connector
import os
from fastapi import FastAPI, Request, Header, HTTPException, status
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from pydantic import BaseModel

MY_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

class LoginAdmin(BaseModel):
    email: str
    password: str

class Login(BaseModel):
    nom: str
    prenom: str
    email: str
    date_naissance: str
    ville: str
    code_postal: str


app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/users")
async def get_users(authorization: Optional[str] = Header(None)):
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
        )
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization scheme. Must be 'Bearer'.",
        )
    token = authorization.split(" ")[1]
    try:
        decoded_payload = jwt.decode(token, MY_SECRET, algorithms=[ALGORITHM])

        # Connexion à la base de données
        conn = mysql.connector.connect(
            database=os.getenv("MYSQL_DATABASE"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            port=3306,
            host=os.getenv("MYSQL_HOST")
        )
        cursor = conn.cursor()

        # Récupérer TOUTES les informations des utilisateurs pour l'admin
        sql_select_Query = "SELECT id, nom, prenom, email, date_naissance, ville, code_postal FROM utilisateur"
        cursor.execute(sql_select_Query)
        records = cursor.fetchall()

        # Convertir en liste de dictionnaires avec toutes les informations
        users = []
        for row in records:
            users.append({
                "id": row[0],
                "nom": row[1],
                "prenom": row[2],
                "email": row[3],
                "date_naissance": str(row[4]) if row[4] else None,  # Convertir la date en string
                "ville": row[5],
                "code_postal": row[6]
            })

        cursor.close()
        conn.close()

        return {"utilisateurs": users}

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        print(f"Erreur lors de la récupération des utilisateurs: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/login")
async def login_admin(login: LoginAdmin):
    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST"))
    cursor = conn.cursor()
    email = login.email
    password = login.password
    sql_select_Query = "select * from admin WHERE email=\""+ str(email) +"\" AND password=\""+ str(password)+"\";"
    cursor.execute(sql_select_Query)
    # get all records
    records = cursor.fetchall()
    if cursor.rowcount > 0:
        encoded_jwt = jwt.encode({'data': [{'email':email}]}, MY_SECRET, algorithm=ALGORITHM)
        return {"access_token": encoded_jwt}
    else:
        raise Exception("Bad credentials")

@app.post("/register")
async def register_user(login: Login):
    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST")
    )
    cursor = conn.cursor()

    # Vérifie si l'utilisateur existe déjà
    check_query = "SELECT * FROM utilisateur WHERE email = %s"
    cursor.execute(check_query, (login.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Utilisateur déjà existant")

    # Insère le nouvel utilisateur
    insert_query = """
        INSERT INTO utilisateur (nom, prenom, email, date_naissance, ville, code_postal)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    values = (
        login.nom,
        login.prenom,
        login.email,
        login.date_naissance,
        login.ville,
        login.code_postal
    )
    cursor.execute(insert_query, values)
    conn.commit()

    return {"message": "Utilisateur créé avec succès"}

@app.delete("/users")
async def deleteUser(id: str, authorization: Optional[str] = Header(None)):
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization scheme. Must be 'Bearer'.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = authorization.split(" ")[1]
    try:
        decoded_payload = jwt.decode(token, MY_SECRET, algorithms=[ALGORITHM])
        conn = mysql.connector.connect(
            database=os.getenv("MYSQL_DATABASE"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            port=3306,
            host=os.getenv("MYSQL_HOST")
        )
        cursor = conn.cursor()
        # Vérifier si l'utilisateur à supprimer est un admin
        cursor.execute("SELECT * FROM admin WHERE id = %s", (id,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            raise HTTPException(status_code=403, detail="Impossible de supprimer un admin.")
        # Supprimer l'utilisateur de la table utilisateur
        cursor.execute("DELETE FROM utilisateur WHERE id = %s", (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Utilisateur supprimé avec succès"}
    except ExpiredSignatureError:
        print("Erreur : Le jeton JWT a expiré.")
        raise Exception("Bad credentials")
    except InvalidTokenError as e:
        print(f"Erreur : Le jeton JWT est invalide : {e}")
        raise Exception("Bad credentials")
    except Exception as e:
        print(f"Une erreur inattendue est survenue lors de la vérification du jeton : {e}")
        raise Exception("Bad credentials")

@app.get("/public-users")
async def get_public_users():
    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST"))
    cursor = conn.cursor()
    sql_select_Query = "SELECT nom, prenom FROM utilisateur"
    cursor.execute(sql_select_Query)
    records = cursor.fetchall()
    # Convertit la liste des tuples en liste de dictionnaires
    users = [{"nom": row[0], "prenom": row[1]} for row in records]
    return {"utilisateurs": users}