
function calculaDeltaDif(na, cl){
    return (na - cl) - 36;
}

function calculaAmenos(na, cl, hco3, alb){
    return na - (cl + hco3 + alb);
}

function claculaDeltaAlbumina(alb){
    return alb - 12;
}

function verificaDistResp(acMet, acIon, alcMet, alcIon){
    return !acMet && !acIon && !alcMet && !alcIon;
}

function limparResult(){
    $('#areaTexto').slideUp('fast');
    $('#resultHMais').empty();
    $('#resultDistIon').empty();
    $('#resultDistMet').empty();
    $('#respDistMet').empty();
    $('#resultDistResp').empty();
    $('#respDistResp').empty();
}

function testaCampo(hMais, pco2, hco3, naMais, clMenos, albMenos){
    if(!hMais || !pco2 || !hco3 || !naMais || !clMenos || !albMenos){
        alert("Preencha todos os campos.");
        return false;
    }
    return true;
}

function erroGasom(hMais, hMaisHand){
    $('#resultHMais').append("<li class='relevante'>Gasometria duvidosa. (Verificar calibragem dos aparelhos e os dados coletados do paciente)</li>");
    $('#resultHMais').append("<li class='relevante'>[H<sup>+</sup>] = " + hMais + " e [H<sup>+</sup>]Handerson = " + hMaisHand + "</li>");
}

function resultHMais(hMais){
    if(hMais > 45){
        $('#resultHMais').append("<li class='relevante'>Acidemia ([H<sup>+</sup>] = " + hMais + ")</li>");
    }else if(hMais < 35){
        $('#resultHMais').append("<li class='relevante'>Alcalemia ([H<sup>+</sup>] = " + hMais + ")</li>");
    }else{
        $('#resultHMais').append("<li>pH normal ([H<sup>+</sup>] = " + hMais + ")</li>");
    }
}

function resultDistIon(deltaDif){
    if(deltaDif > 0){
        $('#resultDistIon').append("<li class='relevante'>Alcalose Iônica (Δ[DIF] = " + deltaDif + ")</li>");
    }else if (deltaDif < 0){
        $('#resultDistIon').append("<li class='relevante'>Acidose Iônica (Δ[DIF] = " + deltaDif + ")</li>");
    }else{
        $('#resultDistIon').append("<li>Δ[DIF] = " + deltaDif + "</li>");
    }
}

function resultDistMet(aMenos, deltaAlb, hco3, pco2){
    var acidCont = 0;
    var alcCont = 0;
    
    var MEAMenos = 2;
    if(aMenos > MEAMenos){
        $('#resultDistMet').append("<li class='relevante'>Acidose Metabólica ([A<sup>-</sup>] = " + aMenos + ")</li>");
        acidCont++;
    }else if(aMenos < (MEAMenos * -1)){
        $('#resultDistMet').append("<li class='relevante'>POSSÍVEL ERRO DE LABORATÓRIO ([A<sup>-</sup>] = " + aMenos + ")</li>");
    }else{
        $('#resultDistMet').append("<li>[A<sup>-</sup>] = " + aMenos + " (Margem de erro: ±" + MEAMenos + ")</li>");
    }
    
    var MEDeltaAlb = 2;
    if(deltaAlb > MEDeltaAlb){
        $('#resultDistMet').append("<li class='relevante'>Acidose Metabólica (Δ[Alb<sup>-</sup>] = " + deltaAlb + ")</li>");
        acidCont++;
    }else if(deltaAlb < (MEDeltaAlb * -1)){
        $('#resultDistMet').append("<li class='relevante'>Alcalose Metabólica (Δ[Alb<sup>-</sup>] = " + deltaAlb + ")</li>");
        alcCont++;
    }else{
        $('#resultDistMet').append("<li>Δ[Alb<sup>-</sup>] = " + deltaAlb + " (Margem de erro: ±" + MEDeltaAlb + ")</li>");
    }
    
    //Resposta Dist Metab:
    var deltaDistSecMetab = 5;
    if(acidCont){
        var prevRedPco2 = 40 - ((24 - hco3) * 1.2);
        var deltaRedPco2 = pco2 - prevRedPco2;
        deltaRedPco2 = parseFloat(deltaRedPco2.toFixed(2));
        if(Math.abs(deltaRedPco2) < deltaDistSecMetab){
            $('#respDistMet').append("<li>Compensação ventilatória adequada (↓pPCO<sub>2</sub> = " + deltaRedPco2 + ")</li>");
        }else{
            $('#respDistMet').append("<li class='relevante'>Redução da PCO<sub>2</sub> (↓pPCO<sub>2</sub> = " + deltaRedPco2 + ")</li>");
        }
    }
    
    if(alcCont){
        var prevAumPco2 = 40 + ((hco3 - 24) * 0.7);
        var deltaAumPco2 = pco2 - prevAumPco2;
        deltaAumPco2 = parseFloat(deltaAumPco2.toFixed(2));
        if(Math.abs(deltaAumPco2) < deltaDistSecMetab){
            $('#respDistMet').append("<li>Compensação ventilatória adequada (↑pPCO<sub>2</sub> = " + deltaAumPco2 + ")</li>");
        }else{
            $('#respDistMet').append("<li class='relevante'>Aumento da PCO<sub>2</sub> (↑pPCO<sub>2</sub> = " + deltaAumPco2 + ")</li>");
        }
    }
}

function resultDistResp(pco2, hco3, checkCronica, checkAguda){
    var acidoseRespiratoria = false;
    var alcaloseRespiratoria = false;
    
    if(pco2 > 45){
         $('#resultDistResp').append("<li class='relevante'>Acidose Respiratória (PCO<sub>2</sub> = "+ pco2 + ")</li>");
        acidoseRespiratoria = true;
    }else if(pco2 < 35){
         $('#resultDistResp').append("<li class='relevante'>Alcalose Respiratória (PCO<sub>2</sub> = "+ pco2 + ")</li>");
        alcaloseRespiratoria = true;
    }else{
        $('#resultDistResp').append("<li>PCO<sub>2</sub> = "+ pco2 + "</li>");
    }
    
    //Resposta Dist Resp:
    var deltaDistSecResp = 2;
    if(acidoseRespiratoria){
        if(checkCronica){
            var prevAumHco3Cronica = 24 + ((pco2 - 40) * 0.3);
            var deltaAumHco3Cronica = hco3 - prevAumHco3Cronica;
            deltaAumHco3Cronica = parseFloat(deltaAumHco3Cronica.toFixed(2));
            if(Math.abs(deltaAumHco3Cronica) < deltaDistSecResp){
                $('#respDistResp').append("<li>Compensação metabólica adequada (↑pHCO<sub>3</sub> = " + deltaAumHco3Cronica + ")</li>");
            }else{
                $('#respDistResp').append("<li class='relevante'>Aumento da HCO<sub>3</sub> (↑pHCO<sub>3</sub> = " + deltaAumHco3Cronica + ")</li>");
            }
        }else if(checkAguda){
            var prevAumHco3Aguda = 24 + ((pco2 - 40) * 0.2);
            var deltaAumHco3Aguda = hco3 - prevAumHco3Aguda;
            deltaAumHco3Aguda = parseFloat(deltaAumHco3Aguda.toFixed(2));
            
            if(Math.abs(deltaAumHco3Aguda) < deltaDistSecResp){
                $('#respDistResp').append("<li>Compensação metabólica adequada (↑pHCO<sub>3</sub> = " + deltaAumHco3Aguda + ")</li>");
            }else{
                $('#respDistResp').append("<li class='relevante'>Aumento da HCO<sub>3</sub> (↑pHCO<sub>3</sub> = " + deltaAumHco3Aguda + ")</li>");
            }
        }
    }
    
    if(alcaloseRespiratoria){
        if(checkCronica){
            var prevRedHco3Cronica = 24 - ((40 - pco2) * 0.4);
            var deltaRedHco3Cronica = hco3 - prevRedHco3Cronica;
            deltaRedHco3Cronica = parseFloat(deltaRedHco3Cronica.toFixed(2));
            if(Math.abs(deltaRedHco3Cronica) < deltaDistSecResp){
                $('#respDistResp').append("<li>Compensação metabólica adequada (↓pHCO<sub>3</sub> = " + deltaRedHco3Cronica + ")</li>");
            }else{
                $('#respDistResp').append("<li class='relevante'>Redução da HCO<sub>3</sub> (↓pHCO<sub>3</sub> = " + deltaRedHco3Cronica + ")</li>");
            }
        }else if(checkAguda){
            var prevRedHco3Aguda = 24 + ((pco2 - 40) * 0.2);
            var deltaRedHco3Aguda = hco3 - prevRedHco3Aguda;
            deltaRedHco3Aguda = parseFloat(deltaRedHco3Aguda.toFixed(2));
            
            if(Math.abs(deltaRedHco3Aguda) < deltaDistSecResp){
                $('#respDistResp').append("<li>Compensação metabólica adequada (↓pHCO<sub>3</sub> = " + deltaRedHco3Aguda + ")</li>");
            }else{
                $('#respDistResp').append("<li class='relevante'>Redução da HCO<sub>3</sub> (↓pHCO<sub>3</sub> = " + deltaRedHco3Aguda + ")</li>");
            }
        }
    }
}

var caso1 = {hMais: 40, pco2: 50, hco3: 30, naMais: 140, clMenos: 104, albMenos: 2.2, rAguda: false, rCronica: true};
var caso2 = {hMais: 51, pco2: 30, hco3: 14, naMais: 130, clMenos: 104, albMenos: 4.3, rAguda: false, rCronica: true};
var caso3 = {hMais: 66, pco2: 40, hco3: 14.5, naMais: 138, clMenos: 114, albMenos: 4.3, rAguda: false, rCronica: true};
var caso4 = {hMais: 36, pco2: 43.5, hco3: 29, naMais: 136, clMenos: 100, albMenos: 2.5, rAguda: false, rCronica: true};
var caso5 = {hMais: 51, pco2: 32, hco3: 15, naMais: 136, clMenos: 100, albMenos: 4.3, rAguda: false, rCronica: true};
var caso6 = {hMais: 30, pco2: 51, hco3: 40, naMais: 132, clMenos: 80, albMenos: 4.3, rAguda: false, rCronica: true};
var caso7 = {hMais: 32, pco2: 48.4, hco3: 36, naMais: 132, clMenos: 90, albMenos: 2.2, rAguda: false, rCronica: true};
var caso8 = {hMais: 40, pco2: 40, hco3: 24, naMais: 132, clMenos: 92, albMenos: 2.2, rAguda: false, rCronica: true};
var caso9 = {hMais: 40, pco2: 40, hco3: 24, naMais: 130, clMenos: 100, albMenos: 2.2, rAguda: false, rCronica: true};
var caso10 = {hMais: 50, pco2: 50, hco3: 24, naMais: 130, clMenos: 100, albMenos: 2.2, rAguda: false, rCronica: true};
var caso11 = {hMais: 24, pco2: 30, hco3: 30, naMais: 140, clMenos: 94, albMenos: 4.3, rAguda: false, rCronica: true};
var caso12 = {hMais: 40, pco2: 50, hco3: 30, naMais: 140, clMenos: 98, albMenos: 4.3, rAguda: false, rCronica: true};
var caso13 = {hMais: 40, pco2: 40, hco3: 24, naMais: 142, clMenos: 100, albMenos: 2.9, rAguda: false, rCronica: true};
var caso14 = {hMais: 56, pco2: 40, hco3: 15, naMais: 140, clMenos: 110, albMenos: 5.4, rAguda: false, rCronica: true};
var caso15 = {hMais: 40, pco2: 30, hco3: 18, naMais: 140, clMenos: 110, albMenos: 4.3, rAguda: false, rCronica: true};
var casos = [caso1, caso2, caso3, caso4, caso5, caso6, caso7, caso8, caso9, caso10, caso11, caso12, caso13, caso14, caso15];

$(document).ready(function(){
    var $selectPac = $('#selectPac');
     $.each(casos, function(index, caso) {
	     $selectPac.append( $('<option></option>').val(index).html('Caso' + (index + 1)) );
       });
       
    $("#btnDiagn").click(function(){
        limparResult();
        
        var hMais = parseFloat($('#hMais').val().replace(",","."));
        var pco2 = parseFloat($('#pco2').val().replace(",","."));
        console.log(pco2);
        var hco3 = parseFloat($('#hco3').val().replace(",","."));
        var naMais = parseFloat($('#naMais').val().replace(",","."));
        var clMenos = parseFloat($('#clMenos').val().replace(",","."));
        var albMenos = parseFloat($('#albMenos').val().replace(",",".")) * 10;
        var checkAguda = $('#rAguda').prop('checked');
        var checkCronica = $('#rCronica').prop('checked');
        
        var hMaisHand = 24 * (pco2 / hco3);
        console.log(hMaisHand);
    
        var deltaGasVal = 1;
        
        var phFromhMais = -1 * Math.log10(hMais / 1000000000);
        phFromhMais = parseFloat(phFromhMais.toFixed(2));
        console.log("phFromhMais: " + phFromhMais);
        
        var albumina = Math.round(albMenos * (0.24 + (phFromhMais - 7.0)/10));
        //var albumina = Math.round(albMenos * 0.28);
        console.log("albumina: " + albumina);
        
        var deltaDif = calculaDeltaDif(naMais, clMenos);
        console.log("deltadif: " + deltaDif);
        
        var aMenos = calculaAmenos(naMais, clMenos, hco3, albumina);
        console.log("amenos: " + aMenos);
        
        
        var deltaAlb = claculaDeltaAlbumina(albumina);
        console.log("deltaAlb: " + deltaAlb);
        
        if(testaCampo(hMais, pco2, hco3, naMais, clMenos, albMenos)){
          if(Math.abs(hMais - hMaisHand) > deltaGasVal){
                erroGasom(hMais, hMaisHand);
            }else{
                resultHMais(hMais);
                resultDistIon(deltaDif);
                resultDistMet(aMenos, deltaAlb, hco3, pco2);
                resultDistResp(pco2, hco3, checkCronica, checkAguda);
            }
            $("#areaTexto").slideDown("slow");  
        }
        
    });
    
    $("#btnLimpar").click(function(){
        $('#hMais').val("");
        $('#pco2').val("");
        $('#hco3').val("");
        $('#naMais').val("");
        $('#clMenos').val("");
        $('#albMenos').val("");
        $('#rAguda').prop('checked', false);
        $('#rCronica').prop('checked', true);
        limparResult();
    });
    
    $("#selectPac").on('change',function(){
        $('#hMais').val(casos[this.value].hMais);
        $('#pco2').val(casos[this.value].pco2);
        $('#hco3').val(casos[this.value].hco3);
        $('#naMais').val(casos[this.value].naMais);
        $('#clMenos').val(casos[this.value].clMenos);
        $('#albMenos').val(casos[this.value].albMenos);
        $('#rAguda').prop('checked', casos[this.value].rAguda);
        $('#rCronica').prop('checked', casos[this.value].rCronica);
    });
});

