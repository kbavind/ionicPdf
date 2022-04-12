import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Platform } from '@ionic/angular';

import { FileOpener } from '@ionic-native/file-opener/ngx';
// import { ExcelConverter } from 'pdfmake-to-excel'

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  myForm: FormGroup;
  pdfObj = null;
  base64Image = null;
  photoPreview = null;
  logoData = null;

  constructor(
    private fb: FormBuilder,
    private plt: Platform,
    private http: HttpClient,
    private fileOpener: FileOpener) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      showLogo: true,
      from: 'xxxx',
      to: 'yyyy',
      text: 'TEST'
    });
    this.loadLocalAssetToBase64();
  }

  loadLocalAssetToBase64() {
    this.http.get('./assets/img/datum.jpg', { responseType: 'blob' })
      .subscribe(res => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.logoData = reader.result;
        }
        reader.readAsDataURL(res);
      });
  }

  createPdf() {
    const formValue = this.myForm.value;
    const image = this.photoPreview ? { image: this.photoPreview, width: 300 } : {};

    let logo = {};
    if (formValue.showLogo) {
      logo = { image: this.logoData, width: 50 };
    }

    const docDefinition = {
      pageOrientation: 'landscape',
      watermark: { text: 'TestPdf', color: 'gray', opacity: 0.2, bold: true, italics: false },
      content: [
        {
          columns: [
            logo,
            {
              text: new Date().toTimeString(),
              allignment: 'right'
            }
          ]
        },
        { text: 'Trying out pdfmake with inputform', style: 'header' },
        { text: 'Also included random table to display using pdfmake', style: 'header' },
        {
          columns: [
            {
              width: '50%',
              text: 'From',
              style: 'subheader'
            },
            {
              width: '50%',
              text: 'To',
              style: 'subheader'
            }
          ]
        },
        {
          columns: [
            {
              width: '50%',
              text: formValue.from
            },
            {
              width: '50%',
              text: formValue.to
            }
          ]
        },
        image,
        { text: formValue.text, margin: [0, 20, 0, 20] },
        {
          table: {
          headerRows: 3,
          widths: ['*', 'auto', 100, 60, 50, 60, 50],

          body: [
            [{
              text: 'Name',
              alignment: 'center',
              rowSpan: 3,
            }, {
              text: 'Age',
              rowSpan: 3,
            }, {
              text: 'Gender',
              alignment: 'center',
              rowSpan: 3
            }, {
              text: 'Marks',
              alignment: 'center',
              colSpan: 4
            }, {}, {}, {}
            ],
            [{}, {}, {}, {
              text: 'First Year',
              alignment: 'center',
              colSpan: 2
            }, {}, {
              text: 'Second Year',
              alignment: 'center',
              colSpan: 2
            }, {}],
            [{}, {}, {}, {
              alignment: 'center',
              text: 'Theory'
            }, {
              alignment: 'center',
              text: 'Practical'
            }, {
              alignment: 'center',
              text: 'Theory'
            }, {
              alignment: 'center',
              text: 'Practical'
            }],
            [ 'XXX', '32', 'Male', '90', '95', '88', '95'],
            ['YYY', '30', 'Female', '95', '95', '80', '95'],
            ['ZZZ', '26', "Male", '70', '90', '75', '90'],

          ],
        },
        },
        { text: '\n\n' },
        {
          style: 'tableExample',
          table: {
              headerRows: 1,
              body: [

                  [{text: 'Order Number', bold:true}, {text: 'Amount', bold:true}],
                  [{text: 'Customer Name: qwertyu', colSpan: 2, bold:true},{}],
                  ['Cust1 - 0', '1234'],
                  ['cust1 - 1', '1312'],
                  ['Cust1 - 2', '14123'],
                  ['Cust1 - 3', '14123'],
                  ['Cust1 - 4', '14123'],
                  ['Cust1 - 5', '14123'],
                  ['Cust1 - 6', '14123'],
                  ['Cust1 - 7', '14123'],
                  ['Cust1 - 8', '14123'],
                  ['Cust1 - 9', '14123'],
                  [{text: 'Customer Name: asdfghjk', colSpan: 2, bold:true},{}],
                  ['Cust2 - 1', '14123'],
                  ['Cust2 - 2', '14123'],
                  ['Cust2 - 3', '14123'],
                  ['Cust2 - 4', '14123'],
                  ['Cust2 - 5', '14123'],
                  ['Cust2 - 6', '14123'],
                  ['Cust2 - 7', '14123'],
                  ['Cust2 - 8', '14123'],
                  ['Cust2 - 9', '14123'],
                  ['Cust2 - 10', '14123'],
              ]
          }
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
    console.log(this.pdfObj);

  }

  downloadPdf() {
    if (this.plt.is('cordova')) {

    } else {
      this.pdfObj.download();
    }
  }

}