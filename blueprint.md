1. Pages: 
   1. Home : 
      1. Tiles (features | pages):
         1. Manage accounts.
         2. Manage apps.
         3. Settings.
   2. Manage accounts :  
      1. Accounts list
      2. Delete selected accounts
      3. Add account: opens a modal that takes a phone number then enables code input to receive otp token from user and submits through a button, then on success modal will be closed, a reset button to reenable phone input and reset form , on fail or success we should show a toast message.
   3. Manage apps: 
      1. App list : a list of applications showing name of app 
      2. Delete selected apps : table action to delete the apps 
      3. Add app: a button that opens a modal receives a appid and a code in column and a submit button to add the app to list.
   4. Setting page: idk what should i put here but we will gonna need this page
2. Layers: 
   1. UI: using react-native-paper
   2. Storage: using react-native-async-storage
   3. Api: using axios
3. Code Structure: i structured code based on layers
   1. UI: all files are located in src/app src/components src/assets based on their nature
   2. Storage: all files are located in src/storage this modules are typically async rw functions based on each piece of data
   3. Api:  all files are located in src/api this modules are typically async get/post functions based for each api call and axios config
