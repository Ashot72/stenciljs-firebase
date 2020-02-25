import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('modal', { read: ElementRef }) modal: ElementRef
  @ViewChild('dbTree', { read: ElementRef }) dbTree: ElementRef

  header = ''
  mode = 'SignIn'
  authKey = 'AIzaSyAJbvF6_AozZdUQ1wEloNMUrsTUDzebjO0'
  dbPath = 'https://svelte-forum.firebaseio.com/forums.json'
  path = ''

  auth (mode: string) {
    const modal = this.modal.nativeElement
    this.mode = mode

    mode === 'SignIn' ? (this.header = 'Sign In') : (this.header = 'Sign Up')
    if (!modal.isOpened) {
      modal.open()
    }
  }

  ngAfterViewInit () {
    this.dbTree.nativeElement.addEventListener(
      'fbsDbPathSelected',
      event => (this.path = event.detail)
    )
  }
}
