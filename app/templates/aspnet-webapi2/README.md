<%= url %> API
-----------

> Public, read-only API for <%= solutionName %> information

**Requirements**

1. .NET 4.5

2. Node.js

  [Download Node.js `>=0.10.0`](https://nodejs.org/) 

3. Install Grunt using NPM

  ```shell  
  npm install -g grunt-cli 
  ```

## .NET Developer Setup

1. Clone repository:

  ```shell
  git clone https://github.com/<%= solutionName %>.git
  ```

2. Install NPM dependencies

  ```shell
  cd <%= solutionName %>
  npm install
  ```
  
3. Build

  ```shell
  grunt build
  ```

4. Configure IIS

  1. Create a new Web Site called `API` (if you don't have one already) and point to any placeholder directory
  2. Create child application called `<%= iisSiteName %>`
  3. Point to `build` folder which will be created automatically in step 3
