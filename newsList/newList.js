let news = [];
let page = 1;
let total_pages = 0;
const pageGroupNumber = 5;
let menus = document.querySelectorAll(".menus button");
let apiKey = "pccBo9CfAs5OXprKeMH0woba9B4YawfppFZMxWX1xQo";
menus.forEach(menu => menu.addEventListener("click", (event)=>retrieveNews(event)));

let searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", () =>{
    retrieveNews('', document.getElementById("search-input").value);
});
let goBackButton = document.getElementById("go-back");
goBackButton.addEventListener("click", ()=>{
    document.location.href = "../index.html";
});

const retrieveNews = async(event, keyWord)=>{
    try{
        let topic = "sport";
        if( event != undefined && event != '' ){
            topic = event.target.textContent.toLowerCase();
        }
        let url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=10`);
        if( keyWord != undefined ){
            url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyWord}&countries=KR&page_size=10`);
        }
        url.searchParams.set('page', page);
        let header = new Headers({'x-api-key': apiKey});
        let response = await fetch(url, {headers:header});
        let data = await response.json();

        total_pages = data.total_pages;
        pate = data.page;
        
        if( response.status == 200 ){
            if( 0 == data.total_hits ){
                throw new Error ("검색된 결과값이 없습니다.");
            }else{
                news = data.articles;
            }
        }else{
            throw new Error (data.message);
        }
        render();
        pageNationRender();
    }catch( error ){
        errorRender(error.message);
    }
}

const render = ()=>{
    let newsHTML = '';
    newsHTML = news.map(item=>{
        return `<div class="row news">
            <div class="col-lg-4">
                <img src="${item.media}">
            </div>
            <div class="col-lg-8">
                <h2>${item.title}</h2>
                <p>${item.summary}</p>
                <div>${item.rights} ${item.published_date}</div>
            </div>
        </div>`;
    }).join('');
    
    document.getElementById("news-board").innerHTML = newsHTML;
}

const pageNationRender = ()=>{
    let pageNationHtml = ``;
    let pageGroup = Math.ceil(page/pageGroupNumber);
    let last = pageGroup * pageGroupNumber;
    let first = last - pageGroupNumber - 1;

    pageNationHtml = `<li class="page-item">
        <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        </a>
    </li>`;

    pageNationHtml = `<li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onClick="moveToPage(${page-1})">
        <span aria-hidden="true">&lt;</span>
        </a>
    </li>`;

    for( let inx=0; inx <= last; inx++ ){
        pageNationHtml += `<li class="page-item ${page==inx?"active":""}"><a class="page-link" href="#" onClick="moveToPage(${inx})">${inx}</a></li>`;
    }

    pageNationHtml = `<li class="page-item">
        <a class="page-link" href="#" aria-label="Next" onClick="moveToPage(${page+1})">
        <span aria-hidden="true">&gt;</span>
        </a>
    </li>`;

    pageNationHtml = `<li class="page-item">
    <a class="page-link" href="#" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
    </a>
  </li>`;

    document.querySelector(".pagination").innerHTML = pageNationHtml;
}

const moveToPage = (pageNum)=>{
    page = pageNum;
    retrieveNews();
}

const errorRender = (message)=>{
    let errorHtml = `<div class="alert alert-danger text-center" role="alert">${message}</div>`;
    document.getElementById("news-board").innerHTML = errorHtml;
}
retrieveNews();