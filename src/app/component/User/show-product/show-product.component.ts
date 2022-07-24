import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { GlobalService } from 'src/app/shared-service/global.service';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.css']
})
export class ShowProductComponent implements OnInit {
  Id:any;
// currentUserObj:new BehaviorSubject(null);
getproductData:any=[];
  constructor(private spinner: NgxSpinnerService,private globalservie:GlobalService,private router:Router) { 
  }
  ngOnInit(): void {
    this.getAllproduct();
  }
  getAllproduct(): void {
    this.spinner.show();
    this.globalservie.getAllproduct().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.spinner.hide();
      this.getproductData = data;
    });
  }
  Editproduct(res:any)
  {
    localStorage.setItem('res',res);
    console.log(res,'Res')
    this.router.navigate(['user/edit-product',res.id]);
  }
  logout()
  {
    this.globalservie.logout();
  }
  Deleteproduct(res:any)
  {
    var result = confirm("Do u Want to delete this data ?");
    if (result) {
      this.globalservie.deleteFile(res);
    }
  }
   
}
