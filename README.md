
1. Safe html tags
6. Caching
7. Update profile pic - WORKING IN MINE
4. Monthly reports- DONE (TO VERIFY)
8. check logged in user - DONE
5. Daily reminder - DONE
2. Flask security and token based authentication - DONE
3. Celery Jobs of exporting blogs of only user - DONE

This application is a Flask and VueJS based web application. It is social platform where multiple users can create blog posts and follow other users to see their blogs.
It provides support for Celery jobs, that can be triggered to be run in the background.

### Requirements
Install redis and celery.

To download the necessary dependencies run the following command on the terminal:

```
   pip install -r requirements.txt 
```

### Running the app
To run the app navigate to the src directory and from the terminal run the following command: 

```
   python app.py 
```
The database will be setup and the server will start running on port 5000. Navigate to http://127.0.0.1:5000 in a browser to start using the app.

