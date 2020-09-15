const ROOT_URL = "https://jsonplaceholder.typicode.com/";
const POSTS_PER_PAGE = 7;
const loadingHTML = document.getElementById("loading-id");
let postsContainer = document.getElementById("posts-container-id");
let pagination = document.getElementById("pagination-id");
let myBlog = new Blog();
myBlog.displayPosts();

function getPosts(){
    let requestURL = ROOT_URL + "posts";
    return fetch(requestURL)
    .then((response)=>{
        if(!response.ok){
            throw new Error (response.status);
        }
        return response.json()})
    .catch((error)=> {
        console.log("The error "+error+" ocurred");
        return false;
    });
}

function displayLoading(){
    loadingHTML.classList.remove("hidden");
}
function hideLoading(){
    loadingHTML.classList.add("hidden");
}

function Blog(){
    function appendFirstPost(postInfor){

    }

    // Returns the clickable elements to display the entire post
    function addPost(postInfo,container){
        //console.log(postInfo);
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
    function addButton(content,page,active=false,last=false){
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

    function displaySinglePost(){

    }
    this.displayPosts =  async function(){
        displayLoading();
        let posts = await getPosts();
        hideLoading();
        if(posts===false){
            console.log("try again");
            return false;
        }
        console.log(posts);
        let test = document.getElementById("test-posts");
        console.log(test);
        //appendPost(posts[0],test);
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
                addButton(i+1,postPage);
            }else{
                addButton(i+1,postPage,true);
            }
            postsPages.push(postPage);
        }
        console.log(postsPages);
        let pageIndex = -1;
        let clickableElements = []; // contains all the clickable elements that can display a post
        let postsIds =[]; //array with all posts ids ordered as the clickableElements
        // for every 3 clickableElemetns (image, title, readMore) there is one ID
    
        posts.forEach((post,index)=>{
            if(index%POSTS_PER_PAGE === 0){
                pageIndex++;
            }
            clickableElements.push(...addPost(post,postsPages[pageIndex]));
            postsIds.push(post.id);
            postsContainer.appendChild(postsPages[pageIndex]);
        });
        console.log(clickableElements);
        console.log(postsIds);

        postsContainer.addEventListener("click",(event)=>{
            let position = clickableElements.indexOf(event.target);
            if(position!==-1){
                console.log(event.target);
                console.log(postsIds[parseInt(position/3)]);
                //displayPOST
            }
        });
    }
}
