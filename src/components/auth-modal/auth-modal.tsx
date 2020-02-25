import { Component, Prop, State, h, Method, Watch, Event, EventEmitter } from '@stencil/core';
import { API_URL, SIGNIN_URL, SIGNUP_URL } from '../../utils/constants';
import { isValidPassword, isValidEmail } from '../../utils/validation';
import * as api from "../../api.js";

@Component({
  tag: 'fbs-auth-modal',
  styleUrl: 'auth-modal.css',
  shadow: true
})
export class AuthModal {
  @Prop() mode = 'SignIn'
  @Prop() dbKey: string
  @Prop({ reflect: true, mutable: true }) opened: boolean

  @State() emailInput: string
  @State() emailInputInvalid = false
  @State() emailInputTouched = false

  @State() pswInput: string
  @State() pswInputInvalid = false
  @State() pswInputTouched = false

  @State() confPswInput: string
  @State() confPswInputInvalid = false
  @State() confPassNotEqual = false
  @State() confPswInputTouched = false

  @State() formValid = false
  @State() loading = false
  @State() error: string

  @Event({ bubbles: true, composed: true }) fbsAuthenticated: EventEmitter

  @Watch('emailInputInvalid')
  @Watch('pswInputInvalid')
  @Watch('confPswInputInvalid')
  @Watch('confPassNotEqual')
  inputChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.isFormValid()
    }
  }

  setDefault() {
    this.emailInput = ""
    this.pswInput = ""
    this.confPswInput = ""

    this.emailInputInvalid = false
    this.pswInputInvalid = false
    this.confPswInputInvalid = false
    this.confPassNotEqual = false

    this.emailInputTouched = false
    this.pswInputTouched = false
    this.confPswInputTouched = false

    this.formValid = false
    this.opened = false
    this.error = null
    this.loading = false
  }

  onCloseModal = (e: Event) => {
    const { className } = e.target as HTMLElement

    if (className.includes('closeModal')) {
      this.setDefault()
    }
  }

  isFormValid() {
    this.formValid = this.emailInputTouched && !this.emailInputInvalid &&
      this.pswInputTouched && !this.pswInputInvalid

    if (this.mode !== 'SignIn') {
      this.formValid = this.formValid &&
        this.confPswInputTouched &&
        !this.confPswInputInvalid &&
        !this.confPassNotEqual
    }
  }

  checkPswsEqual() {
    this.mode !== 'SignIn'
      ? this.pswInput === this.confPswInput
        ? this.confPassNotEqual = false
        : this.confPassNotEqual = true
      : this.confPassNotEqual = false
  }

  onEmailInput(event: Event) {
    this.emailInput = (event.target as HTMLInputElement).value

    !isValidEmail(this.emailInput)
      ? this.emailInputInvalid = true
      : this.emailInputInvalid = false
  }

  onPasswordInput(event: Event) {
    this.pswInput = (event.target as HTMLInputElement).value

    this.checkPswsEqual()
    !isValidPassword(this.pswInput)
      ? this.pswInputInvalid = true
      : this.pswInputInvalid = false
  }

  onConfPasswordInput(event: Event) {
    this.confPswInput = (event.target as HTMLInputElement).value

    this.checkPswsEqual()
    !isValidPassword(this.confPswInput)
      ? this.confPswInputInvalid = true
      : this.confPswInputInvalid = false
  }

  onSubmit = async () => {
    this.error = null
    this.loading = true

    const res = await api.post(
      this.mode === "SignIn"
        ? `${API_URL}/${SIGNIN_URL}?key=${this.dbKey}`
        : `${API_URL}/${SIGNUP_URL}?key=${this.dbKey}`,
      {
        email: this.emailInput,
        password: this.pswInput,
        returnSecureToken: true
      }
    );

    if (res && "error" in res) {
      this.error = res.error.message || res.error
      this.loading = false
    } else {
      const data = {
        idToken: res.idToken,
        refreshToken: res.refreshToken,
        email: res.email,
        expiresIn: res.expiresIn
      };

      this.fbsAuthenticated.emit(data)
      this.setDefault()
    }
  }

  @Method()
  async open() {
    this.opened = true
  }

  render() {
    return (
      <div id="backdrop" class="closeModal" onClick={this.onCloseModal}>
        <div id="modal">
          <span class="close closeModal">&times;</span>
          <header>
            <slot>Submit</slot>
          </header>
          <section id="main">
            {this.loading && <div class="header"><fbs-spinner /></div>}
            {this.error && <div class='error header'>{this.error}</div>}
            <div>{this.opened === true}</div>
            <label htmlFor="email">E-mail</label>
            <input
              type="text"
              id="email"
              placeholder="Your e-mail address"
              onInput={this.onEmailInput.bind(this)}
              onFocus={() => (this.emailInputTouched = true)}
              value={this.emailInput}
            />
            {
              this.emailInputInvalid &&
              this.emailInputTouched &&
              <div class='error'>Invali e-mail address.</div>
            }
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Your password"
              onInput={this.onPasswordInput.bind(this)}
              onFocus={() => (this.pswInputTouched = true)}
              value={this.pswInput}
            />
            {
              this.pswInputInvalid &&
              this.pswInputTouched &&
              <div class='error'>Password should have a minimum of 5 characters</div>
            }
            {this.mode !== 'SignIn' &&
              <span>
                <label htmlFor="cpassword">Confirm Password</label>
                <input
                  type="password"
                  id="cpassword"
                  placeholder="Your Confirm password"
                  onInput={this.onConfPasswordInput.bind(this)}
                  onFocus={() => (this.confPswInputTouched = true)}
                  value={this.confPswInput}
                />
                {
                  this.confPswInputInvalid &&
                  this.confPswInputTouched &&
                  <div class='error'>Confirm Password should have a minimum of 5 characters</div>
                }
                {
                  this.confPassNotEqual && this.confPswInputTouched && !this.confPswInputInvalid &&
                  <div class='error'>Password and confirmation password do not match</div>
                }
              </span>
            }
          </section>
          <footer id="actions">
            <button class="closeModal">Close</button>
            <button onClick={this.onSubmit}
              disabled={!this.formValid}>
              <slot name="submit">Submit</slot>
            </button>
          </footer>
        </div>
      </div >
    )
  }
}
