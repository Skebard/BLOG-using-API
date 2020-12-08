//todo CONSTANTS
const ROOT_URL = "https://jsonplaceholder.typicode.com/";
const POSTS_PER_PAGE = 7;

//todo HTML elemens
let loadingHTML = document.getElementById("loading-id");
let postsContainer = document.getElementById("posts-container-id");
let pagination = document.getElementById("pagination-id");
let postsOverview = document.getElementById("posts-overview-id");

//todo MAIN code
let myBlog = new Blog();
myBlog.displayPosts();





function Blog(){

    class Comment{
        constructor(data,container){
            this.name = data.name;
            this.body = data.body;
            this.email = data.email;
            this.container = container;
            this.commentHTML;
        }
        createHTMLComment(){
            let li = document.createElement("li");
            li.classList.add("hidden");
            let commentName = document.createElement("h4");
            commentName.classList.add("comment-name");
            commentName.textContent = this.name;
            let commentBody = document.createElement("p");
            commentBody.textContent = this.body;
            let commentEmail = document.createElement("small");
            commentEmail.classList.add("comment-email");
            commentEmail.textContent = this.email;
            li.append(commentName,commentBody,commentEmail);
            this.commentHTML = li;
            this.container.appendChild(li);
        }
        displayComment(offset =0){
            setTimeout(()=>{
                this.commentHTML.classList.remove("hidden");
                setTimeout(()=>this.commentHTML.classList.add("fade-in"),50);
                
            },offset);
        }
        hideComment(offset=0){
            setTimeout(()=>{
                this.commentHTML.classList.remove("fade-in");
                setTimeout(()=>{
                    this.commentHTML.classList.add("hidden");
                },2000);
            },offset);
            
        }
    }
    class Post{
        constructor(userId,id,title,body){
            this.id = id;
            this.title = title;
            this.body= body;
            this.userId = userId;
            this.comments =[];
        }
        /**
         * Retuns de data from the userId
         * @param {integer} userId:
         * @retuns {Promise} Promise object represents the data from the required userID
         */
        #getUser(userId){
            let requestURL =ROOT_URL + "users/"+userId;
            return fetch(requestURL)
            .then(response=>{
                if(!response.ok){
                    throw new Error(reponse.status);
                }
                return response.json();
            })
            .catch(error=>{
                return false;
            });
        }
        #getComments(postId){
            let requestURL =ROOT_URL + "posts/"+postId+"/comments";
            return fetch(requestURL)
            .then(response=>{
                if(!response.ok){
                    throw new Error(response.status);
                }
                return response.json();
            }).catch(error=>{
                return false;
            });
        }

        async displayPost(){
            let singlePost = document.createElement("div");
            singlePost.classList.add("single-post");
            let posterPost = document.createElement("div");
            posterPost.classList.add("poster-post");
            posterPost.style.backgroundImage = `url("https://picsum.photos/1400/1120?t=${this.id}")`;
            let postContent = document.createElement("div");

            postContent.classList.add("post-content");
            postContent.classList.add("max-width");
            let postTitle = document.createElement("h1");
            postTitle.textContent = this.title;
            postTitle.classList.add("post-title");

            postsOverview.classList.add("hidden");
            displayLoading();
            let userInfo = await this.#getUser(this.userId);
            hideLoading();
            let authorInfo = document.createElement("div");
            authorInfo.classList.add("author-info");
            let author = document.createElement("h4");
            author.textContent="by";
            let authorName = document.createElement("span");
            authorName.classList.add("author-name");
            authorName.textContent = userInfo.name;
            author.appendChild(authorName);
            let email = document.createElement("h5");
            email.classList.add("email");
            email.textContent = userInfo.email;
            authorInfo.append(author,email)
            let body = document.createElement("p");
            //since the body received from the API is quite short we put it many times
            for( let i=0; i<16; i++){
                body.innerHTML += this.body+"<br>";
                if(!(i%4)) body.innerHTML += "<br>";
            }
            

            let comment = await this.#getComments(this.id);
            //comments
            let commentsContainer = document.createElement("div");
            commentsContainer.classList.add("comments-container");
            let commentTitle = document.createElement("h2");
            commentTitle.classList.add("comments-title");
            commentTitle.textContent = "Comments";
            let btnComments = document.createElement("button");
            btnComments.classList.add("btn-comments");
            btnComments.classList.add("show");
            btnComments.textContent = "Show";

            let ulComments = document.createElement("ul");
            ulComments.classList.add("comments");
            let btnClicked = false;
            btnComments.addEventListener("click",async (event)=>{
                //maybe display loading

                if(event.currentTarget.classList.contains("show")){
                    btnComments.classList.remove("show");
                    btnComments.classList.add("hide");
                    btnComments.textContent = "Hide";
                    if(!btnClicked){
                        let postComments = await this.#getComments(this.id);
                        postComments.forEach((data)=>{
                            let newComment = new Comment(data,ulComments);
                            newComment.createHTMLComment();
                            newComment.displayComment();
                            this.comments.push(newComment);
                        });
                        btnClicked = true;
                    }else{
                        this.comments.forEach((com,index)=>com.displayComment(index*1000));
                    }
                }else{
                   
                    for(let i =this.comments.length-1; i>=0;i--){
                        this.comments[i].hideComment(((this.comments.length-1)-i)*500);
                    }
                    btnComments.classList.add("show");
                    btnComments.classList.remove("hide");
                    btnComments.textContent = "Show";
                }



            });
            commentTitle.appendChild(btnComments);
            commentsContainer.append(commentTitle,ulComments);

            postContent.append(postTitle,authorInfo,body,commentsContainer);
           singlePost.append(posterPost,postContent);
           document.querySelector("main").appendChild(singlePost);
            //hide div with
        }
    }



    function appendFirstPost(postInfor){

    }

    // Returns the clickable elements to display the entire post
    function addPost(postInfo,container){
        let postSummary = document.createElement("li");
        postSummary.classList.add("post-summary");
        let imgPost = document.createElement("img");
        imgPost.src = "https://picsum.photos/650/500?t"+postInfo.id;
        let post = document.createElement("div");
        post.classList.add("post");
        let postTitle = document.createElement("h2");
        postTitle.classList.add("post-title");
        postTitle.textContent = postInfo.title;
        let postBody = document.createElement("div");
        postBody.classList.add("post-body");
        let postBodyText = document.createElement("p");
        postBodyText.classList.add("fade");
        postBodyText.textContent = postInfo.body;
        let postBodyReadMore = document.createElement("a");
        postBodyReadMore.textContent = "Read More >>";
        postBody.append(postBodyText,postBodyReadMore);
        post.append(postTitle,postBody);
        postSummary.append(imgPost,post);
        container.appendChild(postSummary);
        return [imgPost,postTitle,postBodyReadMore];
    }
    function addButtonPagination(content,page,active=false,last=false){
        let container = document.createElement("li");
        let button = document.createElement("button");
        button.textContent = content;
        if(active){
            button.classList.add("active");
        }
        if(last){
            button.classList.add("next-page-btn");

        }else{
            button.addEventListener("click",()=>{
                postsContainer.querySelector("ul:not(.hidden)").classList.add("hidden");
                page.classList.remove("hidden");
                pagination.querySelector("button.active").classList.remove("active");
                button.classList.add("active");
            });
        }
        container.appendChild(button);
        pagination.appendChild(container);
    }



    this.posts = [];
    /**
     * Displays the title and a part of the posts' body.
     * Also adds an event listener to open the clicked post in another page
     */
    this.displayPosts =  async function(){
        displayLoading();
        let posts = await getPosts();
        hideLoading();
        //check for errors
        if(posts===false){
            return false;
        }
        //check deleted local Storage
        //check edited local Storage

        appendFirstPost(posts.shift());
        let postsPages = [];
        let pages = Math.ceil(posts.length/POSTS_PER_PAGE);
        for(let i=0; i<pages; i++){
            let postPage = document.createElement("ul");
            postPage.classList.add("posts-page");
            if(i!==0){
                postPage.classList.add("hidden");
                addButtonPagination(i+1,postPage);
            }else{
                addButtonPagination(i+1,postPage,true);
            }
            postsPages.push(postPage);
        }
        let pageIndex = -1; // stats and -1 because firstly 0%POSTS_PER_PAGE will be 0
        let clickableElements = []; // contains all the clickable elements that can display a post
        let createdPosts =[]; //array with all posts's index (position in the array) ordered as the clickableElements

        //create pages that will contains the posts' overview
        //!Discussion for myself:
        //Wouldn't be better to create the pages when the page is oppend?
        //We are downloading all the pages and maybe the user will only display a few of them
        
        posts.forEach((post,index)=>{
            if(index%POSTS_PER_PAGE === 0){
                pageIndex++;
            }
            clickableElements.push(...addPost(post,postsPages[pageIndex]));
            postsContainer.appendChild(postsPages[pageIndex]);
        });


        postsContainer.addEventListener("click",(event)=>{
            let position = clickableElements.indexOf(event.target);
            if(position!==-1 && !createdPosts.includes(position)){
                let postIndex = parseInt(position/3); // for every 3 clickableElements (image, title, readMore) there is one ID
                createdPosts.push(postIndex);
                //displayPOST
                let pressedPost = posts[postIndex];
                let newPost = new Post(pressedPost.userId,pressedPost.id,pressedPost.title,pressedPost.body);
                this.posts.push(newPost);
                newPost.displayPost();

            }
        });
    }
}


//returns a promise with an array of all the available posts
function getPosts(){
    let requestURL = ROOT_URL + "posts";
    return fetch(requestURL)
    .then((response)=>{
        if(!response.ok){
            throw new Error (response.status);
        }
        return response.json()})
    .catch((error)=> {
        return false;
    });
}


//Displays the loading animation
function displayLoading(){
    loadingHTML.classList.remove("hidden");
}
function hideLoading(){
    loadingHTML.classList.add("hidden");
}




