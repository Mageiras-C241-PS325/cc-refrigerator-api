# Mageiras (Cloud Computing)
Cloud computing side of Mageiras by team C241-PS325

## Table of Contents
- [CC Team](https://github.com/Mageiras-C241-PS325/cc-refrigerator-api#cloud-computing-team)
- [Description](https://github.com/Mageiras-C241-PS325/cc-refrigerator-api#description)
- [Tools and Resources](https://github.com/Mageiras-C241-PS325/cc-refrigerator-api#tools-and-resources)
- [Endpoints](https://github.com/Mageiras-C241-PS325/cc-refrigerator-api#endpoint)
- [Architecture](https://github.com/Mageiras-C241-PS325/cc-refrigerator-api#architecture)

## Cloud Computing Team
|  Name | Bangkit ID |
| ------------ | ------------ |
| Radhiyan Muhammad Hisan | C004D4KY0679 |
| Ridwan Faisal | C299D4KY0177 |

# Description
Utilize JavaScript’s runtime Node.js with HAPI framework for the web server for the API. Before deployment, Postman is used for testing. App Engine to deploy the application and Cloud Storage to store the data. Lastly, the authentication uses Firestore and Firebase

# Tools and Resources
1. Node.js
2. HAPI framework
3. Postman
4. Firestore
5. App Engine
6. Cloud Storage

# Endpoint
|  Endpoint | Method | Body Request (JSON) | Body Response (JSON) |
| ------------ | ------------ | ------------ | ------------ |
| /login | POST | email, password | status, message |
| /register | POST | username, email, password | status, message |
| /logout | POST | email, password | status, message |
| /predict | POST | - | recipe_name, recipe_ingredients, recipe_label, recipe_directions, recipe_genre |
| /ingredients/add | POST | ingredient_name, quantity | status, message |
| /ingredients/{id}/amount | PUT | ingredient_name, quantity | status, message |
| /ingredients/updateOrAdds | PUT | ingredient_name, quantity | status, message |
| /ingredients | GET | email, password | ingredient_name, quantity |
| /ingredients/{id} | GET | ingredient_id | ingredient_id, ingredient_name, quantity |
| /ingredients/{id} | DELETE | ingredient_id | status, message |
| /ingredients | DELETE | email, password | status, message |
| /ingredients/multiple | DELETE | ingredient_id | status, message |

# Architecture
![]()