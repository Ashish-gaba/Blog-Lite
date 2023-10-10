BlogLite is a web app created with VueJs and python-flask. It is social platform where multiple users can create blog posts and follow other users to see their blogs.
It provides support for Celery jobs, that can be triggered to be run in the background.
It also supports caching with the help of redis-server.

### Requirements
Install redis and celery.

To download the necessary dependencies run the following command on the terminal:

```
   pip install -r src/requirements.txt 
```

### Running the app
To run the app navigate to the src directory or directly from the terminal run the following command: 

```
   python src/app.py 
```

Navigate to http://127.0.0.1:5000 in a browser to start using the app.

### Starting the redis server
To start the redis server run the following command in the linux terminal or wsl:

```
   redis-server
```

### Running the celery app
To use celery jobs run the following command in the linux terminal or wsl:

```
   celery  -A  app.celery worker --beat -l info
```

#### Note - Celery and redis will run on linux environment
