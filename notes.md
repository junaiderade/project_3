**Tutorial Complete**

This is for a tutorial series on setting up an HTTPS instance on EC2

https://www.youtube.com/watch?v=q-XEGbipOVw

- first you need to create an ec2
    - use amazon linux and create a key pair, which will allow you to ssh into the machine
    - check the boxes to allow http and https traffic from the internet
    - for SSH set that to "my ip" for security purposes
- you really only need to pay attention starting at the 20min mark

- make sure you have the remote explorer installed in the vs code sidebar
# you can test https on local host wow

# BIG ERROR, you registered the certificate using Public IPv4 address NOT  ec2-100-25-35-172.compute-1.amazonaws.com so only when you click

100.25.35.172, will you see your secure website!!!

# i got an ssl certificate which includes a private.key, ca_bundle.crt, and certificate.crt. I am running a dockerized nodejs app on ec2. how can i apply the certificate so that my website works with https?

To configure your SSL certificate in your Dockerized Node.js app on Amazon EC2, you need to follow the below steps:

Copy your certificate files to your EC2 instance: You can use scp command to copy the files from your local machine to the EC2 instance.

Navigate to the directory where the Dockerfile for your Node.js app is located.

Update the Dockerfile to copy the SSL certificate files into the Docker image during the build process.

Here's an example Dockerfile that copies the certificate files and sets them as environment variables:

bash
Copy code
    # Use an official Node.js runtime as the base image
    FROM node:14

    # Set the working directory in the container to /app
    WORKDIR /app

    # Copy the SSL certificate files into the container
    COPY certificate.crt /app/certificate.crt
    COPY private.key /app/private.key
    COPY ca_bundle.crt /app/ca_bundle.crt

    # Set environment variables for the certificate files
    ENV SSL_CERTIFICATE_FILE /app/certificate.crt
    ENV SSL_PRIVATE_KEY_FILE /app/private.key
    ENV SSL_CA_BUNDLE_FILE /app/ca_bundle.crt

    # Copy the remaining files from the host to the container
    COPY . .

    # Install the app's dependencies
    RUN npm install

    # Start the app
    CMD ["npm", "start"]
Build the Docker image using the updated Dockerfile:

    docker build -t my-node-app .

    Run the Docker image, mapping the host's port 443 to the container's port 443:
    
    docker run -p 443:443 my-node-app

    In your Node.js app, use the environment variables to configure the SSL certificate. Here's an example using Express.js:
    javascript
    Copy code
    const express = require('express');
    const https = require('https');
    const fs = require('fs');

    const app = express();

    const options = {
    key: fs.readFileSync(process.env.SSL_PRIVATE_KEY_FILE),
    cert: fs.readFileSync(process.env.SSL_CERTIFICATE_FILE),
    ca: fs.readFileSync(process.env.SSL_CA_BUNDLE_FILE),
    };

    https.createServer(options, app).listen(443, () => {
    console.log('HTTPS server listening on port 443');
    });
Now, your Node.js app should be accessible over HTTPS on port 443 of your EC2 instance.






# long docker error resolution

im trying to send a file in my nodejs app which runs on docker and im getting this error path must be absolute or specify root to res.sendFile, the file is in the root directory of the app. the docker file has WORKDIR /app and my response looks like res.sendFile('./app/EF9ECE1194E95DC0A4AE86F9613F4B05.txt') what's wrong?

./app/EF9ECE1194E95DC0A4AE86F9613F4B05.txt would resolve to /app/app/EF9ECE1194E95DC0A4AE86F9613F4B05.txt, which does not exist.

To fix this, you should use an absolute path to the file instead of a relative path. You can use the __dirname global variable in Node.js to get the absolute path to the current directory, and then concatenate the file name to get the absolute path to the file.

    Try changing the code to:


    res.sendFile(path.join(__dirname, 'EF9ECE1194E95DC0A4AE86F9613F4B05.txt'));
    In this case, __dirname will give you the absolute path to the current directory (/app), and path.join will concatenate the file name to get the absolute path to the file /app/EF9ECE1194E95DC0A4AE86F9613F4B05.txt.




now im getting this error ReferenceError: path is not defined<br> &nbsp; &nbsp;at /app/server.js
The error is indicating that the path module is not imported in your Node.js code. To resolve this, you need to require the path module in your code by adding the following line at the top of your server.js file:


    const path = require('path');
    After adding this line, you should be able to use the path.join function to generate the correct absolute path to your file.


# i have a docker container running on an ec2 instance. i just pushed an update to the image in AWS ECR. how do i use the command line on my ec2 instance to update the already running container to instead run the updated image?

- do docker stop container_name
- do docker rm container_name
aws ecr get-login-password --region us-east-1 | docker login   --username AWS   --password-stdin 410796116753.dkr.ecr.us-east-1.amazonaws.com
docker run -d --name container_name -p host_port:container_port aws_account_id.dkr.ecr.region.amazonaws.com/image_repository:tag

or

**do this first** to verufy the SSL
docker run -d --name p3 -p 80:3000 410796116753.dkr.ecr.us-east-1.amazonaws.com/project_3:latest
**THEN GO BACK TO ZERO SSL, HIT NEXT AND VERIFY DOMAIN MAKE SURE IT WORKS CORRECT WITH DOCKER, THERE is another blurb above"
then do docker stop and docker rm on p3
then do
docker run -d --name p3 -p 80:3000 410796116753.dkr.ecr.us-east-1.amazonaws.com/project_3:latest


# Docker push commands for project 3 from AWS 

Make sure that you have the latest version of the AWS CLI and Docker installed. For more information, see Getting Started with Amazon ECR .
Use the following steps to authenticate and push an image to your repository. For additional registry authentication methods, including the Amazon ECR credential helper, see Registry Authentication .
Retrieve an authentication token and authenticate your Docker client to your registry.
Use the AWS CLI:

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 410796116753.dkr.ecr.us-east-1.amazonaws.com
Note: If you receive an error using the AWS CLI, make sure that you have the latest version of the AWS CLI and Docker installed.
Build your Docker image using the following command. For information on building a Docker file from scratch see the instructions here . You can skip this step if your image is already built:

docker build -t project_3 .
After the build completes, tag your image so you can push the image to this repository:

docker tag project_3:latest 410796116753.dkr.ecr.us-east-1.amazonaws.com/project_3:latest
Run the following command to push this image to your newly created AWS repository:

docker push 410796116753.dkr.ecr.us-east-1.amazonaws.com/project_3:latest


# How to use ZeroSSL to get HTTPS

- make account
- click create new certificate
- put in public ip of ec2 instance 100.25.35.172
- 90 day cert
- auto gen csr

to verify use http file upload method
download the auth file
drag and drop in server (it's just temporary, you can delete after)
you basically download that file and setup fs and create a new route to that file, watch video to get gist of it

run ther server then try to hit verify button on zero ssl website

if it works hit download certificate

move the private key and certificate.cert and move it into the folder

# How to push a docker container to ECR

create repo on ecr and then do
docker tag p3 410796116753.dkr.ecr.us-east-1.amazonaws.com/project_3
aws configure then enter access key and secret access key
then do like
aws ecr get-login-password --region us-east-1 | docker login   --username AWS   --password-stdin 410796116753.dkr.ecr.us-east-1.amazonaws.com
docker push 410796116753.dkr.ecr.us-east-1.amazonaws.com/project_3  

# How to deploy ECR Container on EC2
https://levelup.gitconnected.com/spinning-up-a-node-js-server-in-a-container-on-aws-with-ec2-2cf7f41f4aec

- do ec2 connect then

sudo yum update -y
sudo amazon-linux-extras install docker
sudo service docker start
sudo chmod 666 /var/run/docker.sock

run aws configure t o set up credentials
log into registry
do like if you are running the app on port 3000
docker pull 410796116753.dkr.ecr.us-east-1.amazonaws.com/project_3
docker run -t -i -d \
-p 80:3000 410796116753.dkr.ecr.us-east-1.amazonaws.com/project_3

# what sudo chmod does in above command 

modifies the file permissions for the /var/run/docker.sock file on an Amazon Linux server.

The chmod command is used to change the permissions on a file or directory. The permissions are represented as a set of three octal digits, which specify the permissions for the file's owner, its group, and others. The 666 octal value means that everyone (owner, group, and others) has read and write access to the file.

The /var/run/docker.sock file is a Unix socket that is used to communicate with the Docker daemon. By default, this file is owned by the root user and has permissions of 660, which means that only the root user and members of the docker group have access to the socket.

By changing the permissions to 666, the command is allowing all users on the system to read and write to the Docker socket. This can be a security concern, as it means that any user on the system can potentially use the Docker socket to execute arbitrary commands as the root user.

In general, it's not recommended to change the permissions of the Docker socket to 666 unless you have a specific reason for doing so and understand the potential security implications. If you need to grant access to the Docker socket to a non-root user, it's generally a better practice to add the user to the docker group and let the default permissions control access to the socket.

# what docker run -t -u -d \ does

The command docker run -t -i -d -p 80:3000 410796116753.dkr.ecr.us-east-1.amazonaws.com/project_3 is used to run a Docker container.

The options used in this command are:

-t: Allocates a pseudo-tty or terminal, to allow you to interact with the container as if it were a terminal.

-i: Keeps stdin open even if not attached, allowing you to enter commands in the terminal.

-d: Runs the container in the background as a daemon process.

-p 80:3000: Maps the host's port 80 to the container's port 3000, allowing network traffic to be redirected to the container.

The image used in this command is from Amazon Elastic Container Registry (ECR), with the repository URI 410796116753.dkr.ecr.us-east-1.amazonaws.com/project_3. This repository contains a Docker image for the "project_3" application.

In summary, this command will run a Docker container based on the "project_3" image, in the background as a daemon process, and map the host's port 80 to the container's port 3000.


# General

- for security, you need a certificate and a key
- you can make your own certificates and sign them but it doesnt work
- you can use zerossl to get 3 90 dayt certificates
- u used zero ssl to get your cert
- one interesting thing to note is netlify gives you an https url by default
    - AFAIK Netfliy is only for static websites; you can't have a Node.js server on Netlify.]
- now i truly understand what a static site it. one that does not change after load.

# do ssl certificates all only last 90 days?

No, SSL certificates do not all only last 90 days. The length of time that an SSL certificate is valid for can vary depending on the type of certificate and the issuing authority.

For example, some SSL certificates are only issued for 90 days (known as a "90-day certificate"), while others can be valid for up to 2 years. Some Certificate Authorities (CA) even offer certificates with longer validity periods, up to 3 years. The specific validity period of an SSL certificate is typically indicated in the certificate itself and is set by the issuing CA.

It's worth noting that while SSL certificates with longer validity periods are generally more convenient (since you don't have to renew them as often), they also tend to be more expensive. Additionally, regardless of the length of the validity period, it's a good security practice to regularly check the status of your SSL certificate and renew it as needed to ensure that your website continues to be properly secured.

# How to redirect traffic from port 3000 to port 80
https://stackoverflow.com/questions/45733444/nginx-docker-forwarding-port-80-443-to-3000


# # how to get ec2 instance connect up and running
https://aws.amazon.com/premiumsupport/knowledge-center/ec2-instance-connect-troubleshooting/

run below command in your terminal to get the ip address amazon runs ec2 isntance connect from 

    $ curl -s https://ip-ranges.amazonaws.com/ip-ranges.json| jq -r '.prefixes[] | select(.region=="us-east-1") | select(.service=="EC2_INSTANCE_CONNECT") | .ip_prefix'


then go into ec2 security group and add source as that IP address and port as 22 and you should be able to connect

# #if I tell aws that i can only ssh to EC2 via my own IP address, then will i still be able to use ec2 connect>
If you have restricted access to your EC2 instance to only allow SSH connections from your own IP address, you may not be able to use EC2 Connect, as the connection originates from an IP address belonging to AWS, rather than your own IP address.

EC2 Connect is designed to provide a secure connection to your EC2 instance, but if you have restricted access to your instance to only allow connections from specific IP addresses, you'll need to make sure that the IP address range used by EC2 Connect is included in the list of allowed IP addresses.

You can do this by adding the IP address range for EC2 Connect to the security group associated with your EC2 instance. You can find the IP address range for EC2 Connect in the documentation for the AWS Region that you're using. Once you've added the IP address range to the security group, you should be able to use EC2 Connect to connect to your EC2 instance.

Keep in mind that the IP address range used by EC2 Connect may change, so you may need to periodically check and update the security group to ensure that you can continue to use EC2 Connect to connect to your EC2 instance.