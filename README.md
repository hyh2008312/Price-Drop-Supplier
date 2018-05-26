# Xberts web app

## Deployment

### Setup
  
  - Add bitbucket git remote
  
        git remote add staging https://heyh@bitbucket.org/socialcommer/price-drop-admin.git
        git remote add prod https://heyh@bitbucket.org/socialcommer/price-drop-admin.git
        
### Update staging server
  - Push update
  
        git push prod master:master
        
### Update production server
  - Run 
        
## Build

Run `npm start` for building and `ng serve` for preview.

## Testing

Running `ng test` will run the unit tests with karma.
