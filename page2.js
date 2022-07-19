
document.querySelector('#sel-uf').addEventListener('change', loadCityList);
document.querySelector('#sel-city').addEventListener('change', loadTableWeather);
const selectCity = document.querySelector('#sel-city');
const selectUF = document.querySelector('#sel-uf');
const msg = document.querySelector("#msg");

function loadWeather(_url){
  return new Promise((resolve, reject) => {
    fetch(_url, { method: 'GET' })
      .then(response => {
        if (response.status===200) {
          return response.json();  
        } else {
          return Promise.reject('Erro carregando previsão do tempo');
        }
      })
      .then(function(data) {
        let objWeather = [];
        let res={};
        let i=0;
        for (let prop in data){
          for (let prop1 in data[prop]){
            i++;
            if (i<3){
              res = {
                  data: prop1,
                  dds: data[prop][prop1]["manha"].dia_semana,
                  dia: 'Manhã',
                  resumo: data[prop][prop1]["manha"].resumo,
                  temp_min: data[prop][prop1]["manha"].temp_min, 
                  temp_max: data[prop][prop1]["manha"].temp_max, 
                  icone: data[prop][prop1]["manha"].icone
                };
                objWeather.push(res);
  
                res = {
                  data: prop1,
                  dds: data[prop][prop1]["tarde"].dia_semana,
                  dia: 'Tarde',
                  resumo: data[prop][prop1]["tarde"].resumo,
                  temp_min: data[prop][prop1]["tarde"].temp_min, 
                  temp_max: data[prop][prop1]["tarde"].temp_max, 
                  icone: data[prop][prop1]["tarde"].icone
                };
                objWeather.push(res);
  
                res = {
                  data: prop1,
                  dds: data[prop][prop1]["noite"].dia_semana,
                  dia: 'Noite',
                  resumo: data[prop][prop1]["noite"].resumo,
                  temp_min: data[prop][prop1]["noite"].temp_min, 
                  temp_max: data[prop][prop1]["noite"].temp_max, 
                  icone: data[prop][prop1]["noite"].icone
                };
                objWeather.push(res);
  
            }else {
                res = {
                  data: prop1,
                  dds: data[prop][prop1].dia_semana,
                  dia: '',
                  resumo: data[prop][prop1].resumo,
                  temp_min: data[prop][prop1].temp_min, 
                  temp_max: data[prop][prop1].temp_max, 
                  icone: data[prop][prop1].icone
                 };
                 objWeather.push(res);    
            }; 
          }; 
        };
        resolve(objWeather);
      })
      .catch(err => {
        reject(err);
      });
  });
}

async function loadTableWeather(){
  const idCity = selectCity.value;
  if (idCity==='') {
    return 
  }

  const optionCity = selectCity.children[selectCity.selectedIndex];
  const optionUF = selectUF.children[selectUF.selectedIndex];
  const ctnTbl = document.querySelector('#ctn-table')
  const weatherTable = document.querySelector('#table');
  weatherTable.innerHTML = ` <tr><th colspan="7">${optionCity.textContent} - ${optionUF.textContent}</th></tr>
                              <tr> 
                                  <th>Data</th> 
                                  <th colspan="2">Dia da Semana</th> 
                                  <th colspan="2">Resumo</th>
                                  <th>Temperatura Mínima (°C)</th>
                                  <th>Temperatura Mínima (°C)</th>
                              </tr>`

  const url = 'https://apiprevmet3.inmet.gov.br/previsao/'+idCity;

  document.querySelector('body').style.cursor='wait';
  try {
    const res = await loadWeather(url);
    const tbl = document.querySelector('#table');
    for (let i=0; i< res.length; i++){
      const newRow = tbl.insertRow(i+2);

      const newCell1 = newRow.insertCell(0);
      const newCell2 = newRow.insertCell(1);
      const newCell3 = newRow.insertCell(2);
      const newCell4 = newRow.insertCell(3);
      const newCell5 = newRow.insertCell(4);
      const newCell6 = newRow.insertCell(5);
      const newCell7 = newRow.insertCell(6);

      newCell1.innerHTML = `${res[i].data}`;
      newCell2.innerHTML = `${res[i].dds}`;
      newCell3.innerHTML = `${res[i].dia}`;
      newCell4.innerHTML = `${res[i].resumo}`;
      newCell5.innerHTML = `<img src="${res[i].icone}" width="40px" height="40px">`;
      newCell6.innerHTML = `${res[i].temp_min}`;
      newCell7.innerHTML = `${res[i].temp_max}`;
    }   
    ctnTbl.style.display='block';
  } catch (err) {
    msg.textContent=err;    
  }  
  document.querySelector('body').style.cursor='default';
}



function loadUF(_url){
  return new Promise((resolve, reject) => {
    fetch(_url, { method: 'GET' })
    .then(response => {
      if (response.status===200) {
        return response.json();  
      } else {
        return Promise.reject('Erro carregando UFs');
      }
    })
    .then(function(data) {
      let res = {};
      let listUF = [];
      for (let i=0; i< data.length; i++){
        res = { id: data[i].id,
                nome: data[i].nome};
        listUF.push(res);
      }  
      resolve(listUF);     
    })
    .catch(err => {
      reject(err);
    });
  });
}

async function loadUfList(){
    selectCity.innerHTML=`  
      <option value="" disabled selected>Selecione...</option>
    `;
    selectUF.innerHTML=`  
      <option value="" disabled selected>Selecione...</option>
    `;
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`;

    try{
      const res = await loadUF(url);
      for (let i=0; i< res.length; i++){
         selectUF.innerHTML+=`<option value="${res[i].id}" >${res[i].nome}</option> 
         `  
      }
    }                  
    catch(err){
      msg.textContent=err;
    };
}

function loadCity(_url){
  return new Promise((resolve, reject) => {
    fetch(_url, { method: 'GET' })
    .then(response => {
      if (response.status===200) {
        return response.json();
      } else {
        return Promise.reject('Erro carregando Municípios');
      }
    }) 
    .then(function(data) {
      let listCity = [];
      let res = {};
      for (let i=0; i< data.length; i++){
        res = { id: data[i].id,
                nome: data[i].nome};
        listCity.push(res);
      }  
      resolve(listCity);         
    })
    .catch(err => {
      reject(err);
    }); 
  })
}

async function loadCityList(){
  const ctnCity = document.querySelector('#ctn-city');
  const ctnTable = document.querySelector('#ctn-table');
  const idUF = selectUF.value;
  ctnCity.style.display='none';
  ctnTable.style.display='none';

  selectCity.innerHTML=`  
    <option value="" disabled selected>Selecione...</option>
  `
  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${idUF}/municipios?orderBy=nome`;
  document.querySelector('body').style.cursor='wait';
  try{ 
    const res = await loadCity(url);
      for (let i=0; i< res.length; i++){
        selectCity.innerHTML+=`<option value="${res[i].id}" >${res[i].nome}</option> 
        `  
      }    
  }  
  catch(err){
    msg.textContent=err;
  };
  ctnCity.style.display='flex';
  document.querySelector('body').style.cursor='default';
}

window.addEventListener("load",() => {
  document.querySelector('body').style.cursor='wait';
  loadUfList();
  document.querySelector('body').style.cursor='default';
});