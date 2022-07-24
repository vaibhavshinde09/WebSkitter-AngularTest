import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BehaviorSubject, Observable,throwError } from 'rxjs';
import { finalize,catchError  } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  apiUrl=environment.ServiceUrl;
  dbPath:any='/Product';
  private basePath = '/uploads';

  currentUserSubject=new BehaviorSubject(localStorage.getItem('res'));
  tutorialsRef!:AngularFireList<any>;
  tutorialsRefFire!: AngularFirestoreCollection<any>;
  constructor(private spinner: NgxSpinnerService,private afAuth: AngularFireAuth,private toastr:ToastrService,
    private afs: AngularFirestore,private dbs:AngularFirestore,private router:Router,private db: AngularFireDatabase,private http: HttpClient,private storage: AngularFireStorage) { 
    this.tutorialsRef = db.list(this.dbPath);
    this.tutorialsRefFire=dbs.collection(this.dbPath);
  }
   createproduct(tutorial: any): any {
    return this.tutorialsRefFire.add(tutorial);
  }
  updateproducts(id: string, data: any): Promise<void> {
    return this.tutorialsRefFire.doc(id).update(data);
  }
  updateproduct(id: string,imgobj:any,data: any) {
    const fileref=this.storage.ref(imgobj.filePath);
    if(imgobj.updateFalg==true)
    {
      this.storage.upload(imgobj.filePath,imgobj.selectedimg.name).snapshotChanges().pipe(
        finalize(() => {
          fileref.getDownloadURL().subscribe(downloadURL => {
            data.url=downloadURL;
            this.updateproducts(id,data).then(() => {
              this.spinner.hide();
              alert('Updated product successfully!');
              return
            });
          })
        }),
        catchError(err => {
          console.log('err', err);
          return throwError('Something bad happened; please try again later.');
        })
      ).subscribe(
      );
    }
    else
    {
      this.spinner.show();
      this.updateproducts(id,data).then(() => {
        this.spinner.hide();
        alert('Updated product successfully!');
        this.router.navigate(['/user/show-product'])
        return
      });
    }
  
  }
  // getAllproduct(): Observable<any> {
  // // return this.tutorialsRefFire = this.dbs.collection('Product').stateChanges();
  // //  let items = this.tutorialsRefFire.snapshotChanges().pipe(map((changes:any) => {
  // //   return changes.map((c:any) => ({ id: c.payload.key, ...c.payload.val() }));
  // //   }));
  //   // return items;
  // //  return this.dbs.collection('Product').snapshotChanges();

  // }
  getAllproduct(): AngularFirestoreCollection<any> {
    return this.tutorialsRefFire;
  }
  uploadImge(filePath:any,selectedimg :any,obj:any)
  {
    this.spinner.show();
    const fileref=this.storage.ref(filePath);
    this.storage.upload(filePath,selectedimg).snapshotChanges().pipe(
      finalize(() => {
        fileref.getDownloadURL().subscribe(downloadURL => {
          obj.url=downloadURL;
          this.createproduct(obj).then(() => {
            this.spinner.hide();
            alert('Created new product successfully!');
            this.router.navigate(['/user/show-product'])
          });
        })
      }),
      catchError(err => {
        console.log('err', err);
        return throwError('Something bad happened; please try again later.');
      })
    ).subscribe(
    );
  }
  getEditproduct(res:any)
  {
    this.currentUserSubject.next(res);
    this.router.navigate(['/user/edit-product',res.id]);
  }
  deleteFile(fileUpload:any): void {
    this.deleteFileDatabase(fileUpload.id)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch(error => console.log(error));
  }
 
  private deleteFileDatabase(key: string): Promise<void> {
    // return this.db.collection(this.basePath).remove(key);
    return this.tutorialsRefFire.doc(key).delete();
  }
  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }
  emailSignup(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }
  logout() {
    this.afAuth.signOut().then(() => {
    this.router.navigate(['/']);
    localStorage.clear();
    localStorage.removeItem('LoggedIn');
    this.toastr.success("User Logged Out Sucessfully");
    });
  }

}


