export default function insertSort(data, key){
    for(let i=1; i<data.length; i++){
        let temp = data[i];
        let j = i-1;
        for(;j>=0;j--){
            if(Number(data[j][key])>Number(temp[key])){
                data[j+1] = data[j];
            }else{
                break;
            }
        }
        data[j+1] = temp;
    }
    return data;
}