const apiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAyMzgwNzEifQ.GEGjhFYABg3rzjNsO1-9V--Osbo4oNgkS0XvS9bR_6pDvYRcJjQGleFPC1HGtoiN2IguZJ7usNwvPuITCdS0QTWVhSHxE1UFEQlQaWvN94CfutSs3mivxrih0NWDUWLo35-jUzWIqeTMYjHjAbLehG5fYwz6RxQUtFaj6n9ywDGP9_xjrJftOJTCezsQ-dUpSBb1AWP8bBirGSrXl8z0aVck8fhjTW9rwOCEmn29C6oTiNqUX7BuriNMcJomqA6HbAPENCZmxTvzOpOLoSIC9Rs-oijAUM3apqRFfvYM7dp7gg0Ldcrdp03wbniODVjE0pfFGQ72dntE3lWArOL4GA";
let boardData;
let characterProfilesData;
let characterEquipmentData;
const page_max_number = 10;
const page_group_number = 5;
let currentPage = 1;
let data_number = 0;
let max_page_number = 0;
let searchType;
let searchText;

document.getElementById("boardSelect").addEventListener("change", ()=>{
    renderBoardTitle();
})

let goBackButton = document.getElementById("go-back");
goBackButton.addEventListener("click", ()=>{
    document.location.href = "../index.html";
});

if( document.getElementById("comboSearchSelect") != undefined ){
    document.getElementById("comboSearchSelect").addEventListener("change", ()=>{
        searchType = document.getElementById("comboSearchSelect").value;
        renderBoard();
    });
}

const textSearch = ()=>{
    searchText = document.getElementById("textSearchInput").value;
    renderBoard();
}

const moveToPage = (targetPage)=>{
    currentPage = targetPage;
    renderNoticeBoard();
    pageNationRender();
}

const renderNoticeBoard = ()=>{
    let noticeBoardHtml = 
    `<table class="table table-dark table-striped">
        <tr>
            <td class="table-info">타입</td>
            <td class="table-info">제목</td>
            <td class="table-info">날짜</td>
        </tr>`;

    if( boardData.length > 0 ){
        let firstIndex = ( currentPage-1 ) * 10;
        let lastIndex = firstIndex + page_max_number - 1;
        if( lastIndex > data_number ){
            lastIndex = data_number;
        }
        boardData.forEach((item, index) => {
            if( index >= firstIndex && index <= lastIndex ){
                noticeBoardHtml += 
                `<tr>
                    <td class="table-light">${item.Type}</td>
                    <td class="table-light"><a href="#" onClick="popupNotice('${item.Link}')">${item.Title}</a></td>
                    <td class="table-light">${new Date(item.Date).toLocaleString()}</td>
                </tr>`;
            }
        });
    }else{
        noticeBoardHtml += `<tr><td colSpan='3' class="table-light" style='text-align: center;'>데이터가 없습니다</td></tr>`;
    }

    noticeBoardHtml += `</table>`;
    document.getElementById("noticeBoard").innerHTML = noticeBoardHtml;
}

const renderCharacterBoard = ()=>{
    let characterBoardHtml;

    if( characterProfilesData != undefined && characterEquipmentData != null ){
        let specialistStyle;
        if( "기상술사" == characterProfilesData.CharacterClassName || "도화가" == characterProfilesData.CharacterClassName ){
            specialistStyle = 'style = "background-position-y: -10rem;"';
        }
        
        characterBoardHtml = 
        `<table background="${characterProfilesData.CharacterImage}" class="table table-borderless characterMainTable" ${specialistStyle}>
            <thead><tr><th colSpan="2" scope="col" id="mainCharacterFirstLine"></th></tr></thead>
            <tbody>
                <tr>
                    <td rowSpan="3" id="mainCharacterSecondLineLeft"></td>
                    <td id="mainCharacterSecondLineRight" style="text-align:right"></td>
                </tr>
                <tr><td id="mainCharacterThirdLine" style="text-align:right"></td></tr>
                <tr><td id="mainCharacterForthLine" style="text-align:right"></td></tr>
                <tr><td colSpan="2" id="mainCharacterFifthLine"></td></tr>
                <tr><td colSpan="2" id="mainCharacterSixthLine"></td></tr>
                <tr><td id="tabBoard"></td></tr>
            </tbody>
        </table>`;

        let mainCharacterFirstLineHtml = 
        `<button type="button" class="btn btn-outline-light characterMainButton">${characterProfilesData.ServerName}</button>
        <button type="button" class="btn btn-outline-light characterMainButton">${characterProfilesData.CharacterClassName}</button>`;

        let mainCharacterSecondLineLeftHtml = 
        `<h2>${characterProfilesData.CharacterName}</h2>`;
        if( characterProfilesData.Title != null ){
            mainCharacterSecondLineLeftHtml += `${characterProfilesData.Title}`;
        }

        let mainCharacterSecondLineRightHtml = `${characterProfilesData.GuildName} 길드`;
        let mainCharacterThirdLineHtml = `Lv.${characterProfilesData.TownLevel}${characterProfilesData.TownName} 영지`;
        let mainCharacterForthLineHtml = `${characterProfilesData.PvpGradeName} PVP`;
        let mainCharacterFifthLineHtml = 
        `<table class="table table-borderless" style="width:200px">
            <tbody>
            <tr>
                <td>아이템</td>
                <td>전투</td>
                <td>원정대</td>
            </tr>
            <tr>
                <td>${characterProfilesData.ItemMaxLevel}</td>
                <td>Lv.${characterProfilesData.CharacterLevel}</td>
                <td>Lv.${characterProfilesData.ExpeditionLevel}</td>
            </tr>
            </tbody>
        </table>`;
        let mainCharacterSixthLineHtml = 
        `<ul class="nav nav-tabs">
            <li class="nav-item"><a class="nav-link active" href="javascript:renderTabBoard('전투')">전투</a></li>
            <li class="nav-item"><a class="nav-link" href="javascript:renderTabBoard('내실')">내실</a></li>
            <li class="nav-item"><a class="nav-link" href="javascript:renderTabBoard('아바타')">아바타</a></li>
            <li class="nav-item"><a class="nav-link" href="javascript:renderTabBoard('통계')">통계</a></li>
            <li class="nav-item"><a class="nav-link" href="javascript:renderTabBoard('캐릭터')">캐릭터</a></li>
            <li class="nav-item"><a class="nav-link" href="javascript:renderTabBoard('길드')">길드</a></li>
        </ul>`;
        
        document.getElementById("noticeBoard").innerHTML = characterBoardHtml;
        document.getElementById("mainCharacterFirstLine").innerHTML = mainCharacterFirstLineHtml;
        document.getElementById("mainCharacterSecondLineLeft").innerHTML = mainCharacterSecondLineLeftHtml;
        document.getElementById("mainCharacterSecondLineRight").innerHTML = mainCharacterSecondLineRightHtml;
        document.getElementById("mainCharacterThirdLine").innerHTML = mainCharacterThirdLineHtml;
        document.getElementById("mainCharacterForthLine").innerHTML = mainCharacterForthLineHtml;
        document.getElementById("mainCharacterFifthLine").innerHTML = mainCharacterFifthLineHtml;
        document.getElementById("mainCharacterSixthLine").innerHTML = mainCharacterSixthLineHtml;
        renderTabBoard('전투');
    }else{
        characterBoardHtml = 
        `<table class="table">
            <thead><tr><th colSpan="2" scope="col" style="text-align:center">검색된 데이터가 없습니다.</th></tr></thead>
            <tbody>
        </table>`;
        document.getElementById("noticeBoard").innerHTML = characterBoardHtml;
    }
}

const renderTabBoard = (boardType)=>{
    let characterTabBoardHtml;

    let navItemMenus = document.getElementsByClassName("nav-link");
    for(let inx=0; inx < navItemMenus.length; inx++){
        if( navItemMenus[inx].textContent == boardType ){
            navItemMenus[inx].className = "nav-link active";
        }else{
            navItemMenus[inx].className = "nav-link";
        }
    }

    if( "전투" == boardType ){
        let stats = characterProfilesData.Stats;
        let combatStats = stats.slice(0,6).sort((a,b) => a.Value < b.Value ? -1: 1);
        let attackPower;
        let fullVitality;
        stats.map( function(item){
            if( item.Type == '공격력'){
                attackPower = item.Value;
            }else if( item.Type == '최대 생명력'){
                fullVitality = item.Value;
            }
        });
            
        let equipments = characterEquipmentData.slice(0,6)
        let characterEquipmentList = [];
        let effectList = [];
        equipments.map( function(item){
            let tooltip = JSON.parse(item.Tooltip);
            //console.log("tooltip : ", tooltip);
            let characterEquipment = {};
            characterEquipment.Type = item.Type;
            characterEquipment.Step = item.Name.substr(1,2);
            characterEquipment.Quality = tooltip.Element_001.value.qualityValue;

            let effectName;
            let effectGrade;
            if( "ItemPartBox" == tooltip.Element_008.type ){
                effectName = tooltip.Element_008.value.Element_001.substr(0, tooltip.Element_008.value.Element_001.indexOf(' <FONT'));
                effectGrade = tooltip.Element_008.value.Element_001.substr(tooltip.Element_008.value.Element_001.indexOf('Lv.')+3,1);
            }else if( "ItemPartBox" == tooltip.Element_009.type ){
                effectName = tooltip.Element_009.value.Element_001.substr(0, tooltip.Element_009.value.Element_001.indexOf(' <FONT'));
                effectGrade = tooltip.Element_009.value.Element_001.substr(tooltip.Element_009.value.Element_001.indexOf('Lv.')+3,1);
            }else{
                effectName = tooltip.Element_010.value.Element_001.substr(0, tooltip.Element_010.value.Element_001.indexOf(' <FONT'));
                effectGrade = tooltip.Element_010.value.Element_001.substr(tooltip.Element_010.value.Element_001.indexOf('Lv.')+3,1);
            }
            
            let existEffect = false;
            for( let inx=0; inx < effectList.length; inx++ ){
                if( effectList[inx].Name == effectName ){
                    effectList[inx].Grade = effectList[inx].Grade + effectGrade;
                    existEffect = true;
                }
            }
            if( !existEffect ){
                let effect = {
                    Name : effectName,
                    Grade : effectGrade
                }
                effectList.push({...effect});
            }
            
            characterEquipment.Image = item.Icon;
            characterEquipmentList.push({...characterEquipment});
        });
        
        let effectHtml = "";
        effectList.map( function(item){
            effectHtml += `<div style="padding-left: 10px;">${item.Name} ${item.Grade}</div>`;
        });

        let equipmentHtml = `<table><tr>`;
        characterEquipmentList.map( function(item){
            let qualityBGColor = "blue"
            if( parseInt(item.Quality) == 100 ){
                qualityBGColor = "#EA6811"
            }else if( parseInt(item.Quality) > 90 ){
                qualityBGColor = "#DF18E3"
            }else if( parseInt(item.Quality) > 70 ){
                qualityBGColor = "#1260EB"
            }else if( parseInt(item.Quality) > 30 ){
                qualityBGColor = "#09AE09"
            }else if( parseInt(item.Quality) > 20 ){
                qualityBGColor = "#A79300"
            }else{
                qualityBGColor = "#FF0000";
            }

            equipmentHtml += 
            `<td style="text-align: center;padding-right: 10px;">
                <div><img src="${item.Image}" /></div>
                <div style="background-color: ${qualityBGColor};">${item.Quality}</div>
                <div>${item.Type}${item.Step}</div>
            </td>`
        });
        equipmentHtml += `</tr></table>`;

        characterTabBoardHtml = 
        `<div class="container text-left" style="background-color: #181818;">
            <div class="row">
                <div class="col">
                    <table class="table table-borderless">
                        <tbody>
                            <tr><td>${combatStats[0].Type}</td><td>${combatStats[1].Type}</td></tr>
                            <tr><td>${combatStats[0].Value}</td><td>${combatStats[1].Value}</td></tr>
                            <tr><td>특성합</td><td>${combatStats.map(item => parseInt(item.Value)).reduce((prev, curr) => prev + curr, 0)}</td></tr>
                            <tr><td>공격력</td><td>${attackPower}</td></tr>
                            <tr><td>최대생명력</td><td>${fullVitality}</td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-9">
                    <table class="table table-borderless">
                        <tbody>
                            <tr><td style="display:flex"><div>장비</div> ${effectHtml}</td></tr>
                            <tr><td style="display:flex">${equipmentHtml}</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
    }else{
        characterTabBoardHtml = boardType;
    }

    document.getElementById("tabBoard").innerHTML = characterTabBoardHtml;
}

const renderBoard = async () =>{
    if( "공지사항" == document.getElementById("boardSelect").value ){
        let url = new URL(`https://developer-lostark.game.onstove.com/news/notices`);
        if( searchType != undefined && searchType != '' ){
            url.searchParams.set('type', searchType);
        }
        if( searchText != undefined && searchText != '' ){
            url.searchParams.set('searchText', searchText);
        }
        let header = new Headers({'authorization': 'bearer ' + apiKey});
        let response = await fetch(url, {headers:header});
        boardData = await response.json();
        data_number = boardData.length;
        max_page_number = Math.ceil(data_number/page_max_number);
        renderNoticeBoard();
        pageNationRender();
    }else if( "캐릭터검색" == document.getElementById("boardSelect").value ){
        if( document.getElementById("textSearchInput") != undefined ){
            if( "" != document.getElementById("textSearchInput").value ){
                let url = new URL(`https://developer-lostark.game.onstove.com/armories/characters/${document.getElementById("textSearchInput").value}/profiles`);
                let header = new Headers({'authorization': 'bearer ' + apiKey});
                let response = await fetch(url, {headers:header});
                characterProfilesData = await response.json();
                console.log("characterProfilesData : ", characterProfilesData);

                url = new URL(`https://developer-lostark.game.onstove.com/armories/characters/${document.getElementById("textSearchInput").value}/equipment`);
                response = await fetch(url, {headers:header});
                characterEquipmentData = await response.json();
                console.log("characterEquipmentData : ", characterEquipmentData);

            }
            renderCharacterBoard();
        }
    }
}
renderBoard();

const renderBoardTitle = ()=>{
    document.getElementById("boardTitle").innerHTML = document.getElementById("boardSelect").value;

    let searchBoardHtml;
    if( "공지사항" == document.getElementById("boardSelect").value ){
        searchBoardHtml = 
        `<div class="input-group mb-3" style="width: 400px;">
            <label class="input-group-text" for="comboSearchSelect">Search</label>
            <select class="form-select" id="comboSearchSelect">
                <option></option>
                <option value="공지">공지</option>
                <option value="점검">점검</option>
                <option value="상점">상점</option>
                <option value="이벤트">이벤트</option>
            </select>
            <input type="text" id="textSearchInput" onkeyup="if(window.event.keyCode==13){textSearch()}" class="form-control" placeholder="SearchText" aria-label="SearchText" aria-describedby="basic-addon1" style="width: 200px;" />
        </div>`;
        document.getElementById("searchBoard").innerHTML = searchBoardHtml;
        renderBoard();
    }else if( "캐릭터검색" == document.getElementById("boardSelect").value ){
        searchBoardHtml = 
        `<div class="input-group mb-3" style="width: 300px;">
            <label class="input-group-text" for="comboSearchSelect">캐릭터명</label>
            <input type="text" value="이루티야" id="textSearchInput" onkeyup="if(window.event.keyCode==13){textSearch()}" class="form-control" placeholder="SearchText" aria-label="SearchText" aria-describedby="basic-addon1" style="width: 200px;" />
        </div>`;
        document.getElementById("searchBoard").innerHTML = searchBoardHtml;
        renderBoard();
    }
}
renderBoardTitle();

const pageNationRender = ()=>{
    let pageNationHtml = ``;
    let pageGroup = Math.ceil(currentPage/page_group_number);
    let last = page_group_number * pageGroup;
    let first = last - ( page_group_number - 1 );
    if( last > max_page_number ){
        last = max_page_number;
    }

    if( pageGroup > 1 ){
        pageNationHtml += 
        `<li class="page-item">
            <a class="page-link" href="#" aria-label="Previous" onClick="moveToPage(1)">
            <span aria-hidden="true">&laquo;</span>
            </a>
        </li>`;
    }

    if( currentPage > 1 ){
        pageNationHtml += 
        `<li class="page-item">
            <a class="page-link" href="#" aria-label="Previous" onClick="moveToPage(${currentPage-1})">
            <span aria-hidden="true">&lt;</span>
            </a>
        </li>`;
    }

    for( let inx=first; inx <= last; inx++ ){
        pageNationHtml += `<li class="page-item ${currentPage==inx?"active":""}"><a class="page-link" href="#" onClick="moveToPage(${inx})">${inx}</a></li>`;
    }

    if( currentPage < max_page_number ){
        pageNationHtml += 
        `<li class="page-item">
            <a class="page-link" href="#" aria-label="Next" onClick="moveToPage(${currentPage+1})">
            <span aria-hidden="true">&gt;</span>
            </a>
        </li>`;
    }

    if( pageGroup < Math.ceil(max_page_number/page_group_number) ){
        pageNationHtml += 
        `<li class="page-item">
            <a class="page-link" href="#" aria-label="Next" onClick="moveToPage(${max_page_number})">
            <span aria-hidden="true">&raquo;</span>
            </a>
        </li>`;
    }
    document.querySelector(".pagination").innerHTML = pageNationHtml;
}

const popupNotice = (urlLink) =>{
    var name = "Notice Popup";
    var option = "width=1024, height=768, location=no"
    window.open(urlLink, name, option);
};
