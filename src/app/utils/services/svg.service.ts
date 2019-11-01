import { Injectable } from '@angular/core';

@Injectable()
export class SvgService {

  constructor() { }

  b64toBlob(b64Data: any, contentType: string, sliceSize: number) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  calculateCentroid(areaPoints: any)  {
    let centroidX = 0, centroidY = 0;

    areaPoints.forEach(point => {
      centroidX += point.x;
      centroidY += point.y;
    });

    centroidX = centroidX / areaPoints.length;
    centroidY = centroidY / areaPoints.length;

    return {
      x : centroidX,
      y: centroidY
    }
  }

  convertSVGPointToZoomPoint(centroid, pan, zoom){
    let tx, ty;
    tx = centroid.x;
    ty = centroid.y;

    tx = tx * zoom;
    ty = ty * zoom;
      
    tx = tx + pan.x;
    ty = ty + pan.y;

    return {
      x : tx,
      y : ty
    }
  }

}
