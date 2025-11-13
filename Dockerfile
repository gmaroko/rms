# Step 1: Using Nginx image
FROM nginx:alpine

# Step 2: Setup working dir
WORKDIR /usr/share/nginx/html

# Step 3: Remove default Nginx static assets
RUN rm -rf ./*

# Step 4: Copy files
COPY . .

# Step 5: Expose port 80
EXPOSE 80

# Step 6: Start Nginx
CMD ["nginx", "-g", "daemon off;"]