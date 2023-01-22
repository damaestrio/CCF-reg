# CCF Registration App
## Registration Helper App - import csv file, mark players as registered, export to csv

### What is this?
The CCF Registration is a simple tool to help assist the check-in process at CCF tournaments. It is designed to work offline with no connectivity. 
It takes a .csv file of registered users (in the format the Access Database provides) to generate the list shown. When registration has been completed, it will export
a .csv with the check-ins that will be manually reconciled to generate the final check-in list.

### How do I use it?
The master list should be downloaded onto the local machine, and uploaded into the application prior to the tournament. 
The application will store in memory the uploaded list, and will store the list of check-in users (even when it is restarted).

The 'section' drop down will ONLY change the name of the .csv file generated, it will not filter the master list. Section will be saved by the app, even if the app is restarted.

There is a 'late' section option that can be used for late check-ins.

Uploading a new master list will clear out all previous check-ins.

### Creating a new build
To modify the code, you'll need to clone the repo to a location where it can be served. Cloud9 would be recommended (the application was developed in Cloud9 originally)

To create a new build from the github repo, the first step is to clone the remote repo to a local folder.

After that is completed, follow the instructions to install NWJS-Builder-Phoneix (https://github.com/evshiron/nwjs-builder-phoenix)

Once NWJS-Builder-Phoenix is installed, replace the package.json file with the appropriate file (either package.pc.json or package.mac.json).

To test the build, run 'npm run start'. To create a new build, run 'npm run build' which will create a new build in a 'dist' folder in the root directory.

### Can I contribute?

YES! Contributions are welcome! Please reach out on github if you need a developer token for commits.