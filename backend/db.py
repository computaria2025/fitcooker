import mysql.connector
import os

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("localhost"),      # localhost
        user=os.getenv("root"),      # root
        password=os.getenv("bd12"),  # bd12
        database=os.getenv("Fitcooker")   # Fitcooker
    )
