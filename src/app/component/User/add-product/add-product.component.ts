import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { GlobalService } from 'src/app/shared-service/global.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  addproduct:FormGroup;
  updateFalg:boolean=false;
  selimageUrl:any;
  ImageSrc:string='';
  Id:any;
  getproductData:any=[];
  operation:any='Add';
  selimageUrlUpdate:any;
  constructor(private fb: FormBuilder,private globalservie:GlobalService,private activatedRoute: ActivatedRoute ) {
   this.addproduct=this.fb.group({
      product_name:['', [Validators.required]],
      product_offer_price:['', [Validators.required]],
      product_price:['', [Validators.required]],
      image:[''],
   });
  }
  get f() { return this.addproduct.controls; }
  ngOnInit(): void {
   this.Id=this.activatedRoute.snapshot.paramMap.get("id");
   if(this.Id!=null)
   {
    this.getAllproduct();
    this.operation='Update';
   }
  }
  onSubmit()
  {
    if(this.Id==null)
    {
      var obj={
      product_name:this.addproduct.controls.product_name.value,
      product_offer_price:this.addproduct.controls.product_offer_price.value,
      product_price:this.addproduct.controls.product_price.value,
      image:this.selimageUrl.name,
      base64Image:this.ImageSrc
      };
      let basepath='/uploads';
      var filepath=`${basepath}/${this.selimageUrl.name}`;
      var response=this.globalservie.uploadImge(filepath,this.selimageUrl,obj);
    }
    else
    {
      let basepath='/uploads';
      let filepath;
      if(this.updateFalg==true)
      {
        filepath=`${basepath}/${this.selimageUrl.name}`;
      }
      else
      {
        filepath=`${basepath}/${this.selimageUrl}`;
      }
      let obj={filepath:filepath,selectedimg:this.selimageUrl,updateFalg:this.updateFalg};
      let updateobj={ product_name:this.addproduct.controls.product_name.value,
        product_offer_price:this.addproduct.controls.product_offer_price.value,
        product_price:this.addproduct.controls.product_price.value,
        image:this.selimageUrlUpdate,
        base64Image:this.ImageSrc
      }
        // filepath:filepath
        let updateResponse=this.globalservie.updateproduct(this.Id,obj,updateobj);
    }
  }
  keyPressNumbers(event:any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (((charCode < 48 || charCode > 57) && charCode != 46)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  imagePreview(event:any)
  {
    if(event.target.files && event.target.files[0])
    {
    const render=new FileReader();
    render.onload=(e:any)=>
    this.ImageSrc=e.target.result;
    render.readAsDataURL(event.target.files[0])
    this.selimageUrl=event.target.files[0];
    this.selimageUrlUpdate=event.target.files[0].name;
    this.updateFalg=true;
    }
    else
    {

    }
  }
  getAllproduct(): void {
    this.globalservie.getAllproduct().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.getproductData=data.filter((ele:any) => ele.id ===this.Id);
      this.addproduct.controls['product_name'].setValue(this.getproductData[0].product_name);
      this.addproduct.controls['product_offer_price'].setValue(this.getproductData[0].product_offer_price);
      this.addproduct.controls['product_price'].setValue(this.getproductData[0].product_price);
       this.addproduct.controls['image'].setValue(this.getproductData[0].image);
      this.selimageUrlUpdate=this.getproductData[0].image;
      this.ImageSrc=this.getproductData[0].base64Image;
    });
  }

}
