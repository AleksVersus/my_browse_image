import filesJsonStruct from './files.json';
window.filesJsonStruct = filesJsonStruct;
window.currentFilesList = [];
window.standartMainScreen = document.getElementById('main-screen').innerHTML;


function getStructByPath(folderStructure, folderPath) {
    // функция вытаскивает структуру по указанному пути    // рекурсивна
    let instr = folderPath.indexOf('/');
    if (instr != -1) {
        return getStructByPath(folderStructure[folderPath.slice(0, instr)], folderPath.slice(instr+1));
    } else if (folderPath != '') {
        return folderStructure[folderPath];
    } else {
        return folderStructure;
    }
}

function getBackFolder(folderPath) {
    // функция вытаскивает путь к предыдущей папке
    let instr = folderPath.lastIndexOf('/');
    return (instr!=-1 ? folderPath.slice(0, instr) : "");
}

function getFolderTale(folderPath) {
    // функция вытаскивает хвост из пути к папке
    let instr = folderPath.lastIndexOf('/');
    return (instr!=-1 ? folderPath.slice(instr+1) : folderPath);  
}

function genMiniaturesBox(folderStructure, folderPath, page) {
    let miniaturesBox = '<div class="miniatures-page"><div class="files-grid">';
    let wide = 35;
    window.currentFilesList = folderStructure; // глобальной переменной присваиваем список файлов
    let files_count = window.currentFilesList.length;
    let max_page = (files_count % wide == 0 ? parseInt(files_count/wide) : parseInt(files_count/wide)+1);
    console.log(`wide ${wide}, files ${files_count} max_page ${max_page}`)
    for (let i=0+wide*page; i < 35+wide*page; i++) {
        if (i < files_count) {
            miniaturesBox += `<div class="miniature"><img src="sorted/${window.currentFilesList[i]}" class="miniature_img" /></div>`;
        } else {
            break;
        }
    }
    miniaturesBox += '</div>';
        miniaturesBox += '<div class="pagination-buttons">';
            if (page != 0)
                {miniaturesBox += `<div class="button-pagination prev-button" onClick="genMiniaturesBox(window.currentFilesList, '${folderPath}', ${page-1})">&lt;</div>`}
            else
                {miniaturesBox += '<div class="button-pagination">&lt;</div>'}
            miniaturesBox += `<div class="button-pagination page-number">${page+1}</div>`
            if (page<max_page-1)
                {miniaturesBox += `<div class="button-pagination next-button" onclick="genMiniaturesBox(window.currentFilesList, '${folderPath}', ${page+1})">&gt;</div>`}
            else
                {miniaturesBox += '<div class="button-pagination">&gt;</div>'}
        miniaturesBox += '</div>';
    miniaturesBox += '</div>';
    document.getElementById('main-screen').innerHTML = miniaturesBox;
}

function genNavigateChain(folderPath) {
    let navigateChain = '<ul id="navigate-chain-path"></ul>';
    document.getElementById('navigate-chain').innerHTML = navigateChain;
    while (folderPath != "") {
        appendInNavigateChain(folderPath, getFolderTale(folderPath));
        folderPath = getBackFolder(folderPath);
    }
    appendInNavigateChain('', 'main');
}

function appendInNavigateChain(folderPath='', tale='main') {
    tale = (tale=='main' ? tale : `&nbsp;&gt;&nbsp;${tale}`);
    let lp = document.createElement('li');
    lp.setAttribute('class', 'navigate-chain-point');
    lp.innerHTML = `<a onclick="regenPageContent(filesJsonStruct, '${folderPath}')">${tale}</a>`;
    document.getElementById('navigate-chain-path').prepend(lp);
}

function getFolderKeys(folderStructure) {
    // пришлось добавить функцию, перемещающую ключ точку в начало массива
    let keys = Object.keys(folderStructure);
    let instr = keys.indexOf('.');
    for (let i=0; i<instr; i++) {
        let t = keys[i];
        keys[i] = keys[instr];
        keys[instr] = t;
    };
    return keys;
}

function regenPageContent(folderStructure, levelFolderPath) {
    console.log('fp:'+levelFolderPath);
    let previousFolder = getBackFolder(levelFolderPath);
    let currentFolderStruct = getStructByPath(folderStructure, levelFolderPath);
    let currentFolderKeys = getFolderKeys(currentFolderStruct);

    let navigateTree = '<ul id="navigate-tree-list">';

    // console.log(currentFolderKeys);
    for (let i=0; i<currentFolderKeys.length; ++i) {
        if (currentFolderKeys[i] == ".") {
            if (levelFolderPath != ''){
                navigateTree += `<li id="navigate-tree-back-button"><a onclick="regenPageContent(filesJsonStruct, '${previousFolder}')">Назад</a></li>`
            }
            if (currentFolderStruct['.'].length > 0) {
                genMiniaturesBox(currentFolderStruct['.'], levelFolderPath, 0)
            } else {
                currentFilesList = [];
                document.getElementById('main-screen').innerHTML = standartMainScreen;
            }
        } else {
            let nextFolder = (levelFolderPath == '' ? `${currentFolderKeys[i]}` : `${levelFolderPath}/${currentFolderKeys[i]}`);
            navigateTree += `<li class="navigate-tree-point"><a onclick="regenPageContent(filesJsonStruct, '${nextFolder}')">${currentFolderKeys[i]}</a></li>`
        }
    }
    navigateTree += '</ul>';
    document.getElementById('navigate-tree').innerHTML = navigateTree;
    genNavigateChain(levelFolderPath);
}

regenPageContent(filesJsonStruct, '');
