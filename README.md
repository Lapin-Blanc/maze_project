# maze_project
## install procedure

    git clone https://github.com/Lapin-Blanc/maze_project.git
    python -m venv env
    cd maze_project
    .\env\Scripts\activate
    python -m pip install -r .\requirements.txt
    python .\manage.py makemigrations
    python .\manage.py migrate
    python .\manage.py loaddata maze_project.json
    python .\manage.py runserver

http://localhost:8000 
two browsers / two players :
fabien/corine
corine/fabien

http://localhost:8000/admin
fabien/corine