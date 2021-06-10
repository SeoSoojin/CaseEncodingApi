# EncodedApi

## Instructions

- No need to npm install, since this project dosnt have any dependencies

```bash 
npm start
```

- Description: Starts the server.js
- Code: node server.js

```bash 
npm test
```

- Description: Test all the functions
- Code: npm run test-models && npm run test-server

```bash
npm test-models
```

- Description: Test only the model functions
- Code: node ./models/image.test.js

```bash
npm test-server
```

- Description: Test only the server functions
- Code: node server.test.js

## Design Pattern

 - Based on MVC pattern to better organize code
    
    - raw folder stores the raw images, without any message encoded
    - encoded folder stores the images with the message encoded
    - controllers folder stores all the code that handle with requisitions and resposes
    - models folder stores all the code that handle with data from images

## /upload

  - Description: Upload an image to a temp dir file using multipart/form-data then return the path for this file
  - Curl to test:
    ```bash
    curl    --request POST  
            --url http://localhost:3030/upload  
            --header 'Content-Type: multipart/form-data; 
            boundary=---011000010111000001101001'   
            --form 'file=@test.bmp'
    ```


## /write-message-on-image
    
- Description: Receives a message and a file path via POST of a JSON then encodes the message in the given file and return the new path
- Curl to test: 
    ``` bash 
    curl    --request POST \
            --url http://localhost:3030/write-message-on-image \
            --header 'Content-Type: application/json' \
            --data '{
	                   "path": "./raw/test.bmp",
	                   "phrase": "test"
                    }'
    ```

## /get-image
    
- Description: Receives a encoded image name via GET then return the readable buffer for this image (utf-8 encoded)
- Curl to test: 
    ```bash 
    curl    --request GET \
            --url http://localhost:3030/get-image/test-encoded.bmp 
            --output ./encoded/test.bmp
    ```



## /decode-message-from-image

- Description: Receives a path to an encoded image, decode the message in this file and return the message
- Curl to test: 
    ```bash 
    curl    --request GET \
            --url http://localhost:3030/decode-message-from-image/test-encoded.bmp
    ```
