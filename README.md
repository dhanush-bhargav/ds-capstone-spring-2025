# Multi-Agent Based Intellectual Humility Intervention
Intellectual humility (IH), the recognition of the limits of one's knowledge and 
openness to new perspectives, is a crucial trait for constructive discourse. 
With increasing levels of polarization between individuals, communities, regions, and 
demographic groups, IH may be more important than ever. This project explores a novel 
web-based IH intervention that is rooted in established psychological theory and leverages 
artificial intelligence for scalability and interaction. The intervention protocol is 
designed to make users consider relevant pieces information about an issue and think about
their implications. Multiple large language model (LLM) agents are used to guide each step
of the intervention. Post-test IH was significantly higher than IH before the intervention. 
This work contributes to the young, rapidly-growing fields of intellectual humility and 
AI-driven interventions, and demonstrates the potential for multi-agent systems to promote 
cognitive and behavioral change.

This application was deployed to the cloud using AWS and circulated to over 70 participants
from the George Washington University. Over 50 participants successfully completed the 
intervention using this web application and the generated data was used to analyze the 
effectiveness of this intervention. More details about the intervention, web application, and 
data analyses can be found in the project report and research paper.

## Backend Set-Up
### Install Requirements
The backend is built on [Python 3.12](https://www.python.org/downloads/release/python-3120/) and uses
an [SQLite3](https://www.sqlite.org/download.html) database. Ensure these two are correctly installed
on your system before proceeding.\
The python packages required for this software are listed in `src/requirements.txt`. To install
them:
```shell
cd src
pip install -r requirements.txt
```
### Create Database
Now that you are in the `src` directory, which is the root for all backend code, you need to
create the database and populate it with some default items. To do so, run:
```shell
python database_scripts.py
```
### Update configurations
This will create a `master_db.sqlite3` file to hold all the application data. It will also create
a default Admin user.\
The application performs calls to LLMs hosted in Amazon Bedrock. So make sure you have an AWS account
with the right permissions and access to AWS Bedrock models. Once that is setup, you need to create
a `.env` file to store the following:
```
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOURYOUR_AWS_SECRET_ACCESS_KEY
AWS_REGION_NAME=AWS_REGION
```
and update the `src/config.conf` file to include the name of your AWS Bedrock model, for example:
```
...
[LLMConfig]
model_name=bedrock/us.meta.llama3-3-70b-instruct-v1:0 #Replace with your model name
...
```
### Run backend server
With the terminal in `src`, run:
```shell
python server.py
```
This will start the flask server in localhost at port 5000.

## Frontend Set-Up
### Install requirements
The frontend is build using RectJS and requires [NodeJS](https://nodejs.org/en/download) and
Node Package Manager (NPM) to run. All frontend files are in the `src/frontend` directory.
So make sure you open a new terminal in `src/frontend` for this section. Run the following command
to install requirements:
```shell
npm install
```
### Update Config
Update the file `src/frontend/src/config.js` to ensure it points to the right backend URL:
```javascript
export const baseUrl = "http://localhost:5000"
export const feedbackForm = ""
```
The `feedbackForm` is not necessary since it was used to collect feedback only during prototyping
and beta test.
### Run Frontend
With terminal in the `src/frontend` directory, run the command:
```shell
npm start
```
This will start the frontend and open the web application in a browser tab. You will be shown a 
login page. Since a default Admin user has already been created, you can login using the credentials:
```
username: admin
password: abc@123
```


