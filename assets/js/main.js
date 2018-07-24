var audioContext = null;
var meter = null;

window.onload = function() {
    try{
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
	    audioContext = new AudioContext();
    }catch(e){
        this.alert('이 브라우저에서는 Web Audio API가 지원되지 않습니다. 크롬이나 사파리를 이용해 주세요.');
    }

    try {
        navigator.getUserMedia = 
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;

        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
}

function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;
var data=0;
var cnt = 0;
var desc=null;
var ref=70;
var setVal=0;

function gotStream(stream) {
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);
    
    data=setVal+meter.volume;
    data=data.toFixed(3);
    // data=meter.volume.toFixed(3)+setVal;
    // data=setVal;

    var trace1 = {
        y:[data],
        name:'기준선',
        type: 'line',
    };
    var trace2 = {
        y:[ref],
        type:'line',
        mode:'lines',
    };

    var chartData = [trace1, trace2];
    var layout={
        title: '실시간 그래프',
        showlegend: false,
        "titlefont": {
            "size": 36,
            "color":'#31708f'
        },
        annotations:[
            {
                xref:'paper',
                x:0.07,
                y:70,
                xanchor:'right',
                yanchor:'bottom',
                text:'기준선',
                showarrow:false,
                font:{
                    family:'Arial',
                    size:20,
                    color:'red'
                }
            }
        ]
    };
    Plotly.newPlot('chart', chartData, layout, {scrollZoom:false, displaylogo: false, modeBarButtonsToRemove: ['select2d', 'lasso2d', 'pan2d', 'toImage', 'sendDataToCloud', 'resetScale2d', 'hoverClosestCartesian', 'toggleSpikelines', 'hoverCompareCartesian', 'zoom2d']});

    var trace3 = {
        y:[data],
        type: 'line'
    };
    var trace4 = {
        y:[ref],
        type:'line',
        mode:'lines'
    };

    var chartData2 = [trace3, trace4];
    var layout2={
        title: '전체 그래프',
        showlegend: false,
        "titlefont": {
            "size": 36,
            "color":'#31708f'
        }
    };
    Plotly.newPlot('chart2', chartData2, layout2, {scrollZoom:false, displaylogo: false, modeBarButtonsToRemove: ['select2d', 'lasso2d', 'pan2d', 'toImage', 'sendDataToCloud', 'resetScale2d', 'hoverClosestCartesian', 'toggleSpikelines', 'hoverCompareCartesian', 'zoom2d']});

    setInterval(function(){
        data=setVal+meter.volume;
        data=data.toFixed(3);
        // data=meter.volume.toFixed(3)+setVal;
        // data=setVal;

        if(data<10){
            desc="숨쉬는 소리";
        }
        else if(data<20){
            desc="나뭇잎 스치는 소리";
        }
        else if(data<30){
            desc="속삭이는 소리";
        }
        else if(data<40){
            desc="조용한 도서관";
        }
        else if(data<50){
            desc="조용한 사무실";
        }
        else if(data<60){
            desc="보통 대화소리";
        }
        else if(data<70){
            desc="진공청소기 소리";
        }
        else if(data<80){
            desc="시끄러운 음악";
        }
        else if(data<90){
            desc="잔디깎기 소리";
        }
        else if(data<100){
            desc="모터사이크 소리";
        }
        else if(data<110){
            desc="콘서트";
        }
        else{
            desc="고통을 주는 소음, 천둥";
        }

        document.getElementById("desc").innerHTML = desc;
        document.getElementById("show").innerHTML = data+"dB";

        Plotly.extendTraces('chart',{y:[[data], [ref]]}, [0, 1]);
        ++cnt;
        if(cnt>40){
            Plotly.relayout('chart',{
                xaxis: {
                    range: [cnt-40,cnt]
                }
            })
        }

        Plotly.extendTraces('chart2',{y:[[data], [ref]]}, [0,1]);
    },200);
}
function plus(){
    ++setVal;
    document.getElementById("set").innerHTML = setVal;
}
function minus(){
    --setVal;
    document.getElementById("set").innerHTML = setVal;
}