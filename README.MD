'/upload': Upload an image to a temp dir file using multipart/form-data then return the path for this file

'/write-message-on-image': Receives a message and a file path via POST of a JSON then encodes the message in the given file and return the new path

'/get-image': Receives a encoded image name via GET then return the readable buffer for this image (utf-8 encoded)

'/decode-message-from-image': Receives a path to an encoded image, decode the message in this file and return the message

'./raw/': stores the raw images, without any message encoded

'./encoded/': stores the images with the message encoded
