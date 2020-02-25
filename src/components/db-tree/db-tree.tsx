import { Component, h, Prop, State, Listen, Host, Event, EventEmitter } from "@stencil/core";
import * as api from "../../api.js";

@Component({
    tag: 'fbs-db-tree',
    styleUrl: 'db-tree.css',
    shadow: true
})
export class DbTree {
    container: HTMLDivElement

    @Prop() dbPath: string

    @State() loading = false
    @State() error: string

    @Event({ bubbles: true, composed: true }) fbsDbPathSelected: EventEmitter<string>

    @Listen('fbsAuthenticated', { target: 'body' })
    onTokenObtained(event: CustomEvent) {
        const auth = event.detail
        console.log("auth", auth)
        this.fetchDb(auth)
    }

    async fetchDb(auth) {
        this.removeTree()

        this.error = null

        if (!this.dbPath) {
            this.error = "No database path is specified"
            return
        }

        this.loading = true
        try {
            const res = await api.get(`${this.dbPath}?auth=${auth.idToken}`)

            if (res && typeof res === 'object' && "error" in res) {
                this.error = res.error.message || res.error
                this.loading = false
            } else {
                this.renderTree(res)
                this.loading = false
            }
        } catch (error) {
            this.error = error.message
            this.loading = false
        }
    }

    toggle() {
        const toggler = this.container.getElementsByClassName('caret')

        for (let i = 0; i < toggler.length; i++) {
            toggler[i].addEventListener('click', e => {
                const { classList, parentElement: { nextSibling } } = e.target as HTMLElement
                if (nextSibling) {
                    (nextSibling as Element).querySelector('.nested').classList.toggle('active')
                    classList.toggle('caret-down')
                }

            })
        }
    }

    removeTree() {
        if (this.container.childNodes.length > 0) {
            this.container.removeChild(this.container.childNodes[0]);
        }
    }

    renderTree(data) {
        const tree = document.createElement('ul')
        tree.id = 'rootUl'

        if (typeof data === 'object') {
            this.createList(tree, data)
        }

        const url = new URL(this.dbPath);
        const dbNode = this.createDbNameNode(url.pathname)
        tree.prepend(dbNode)

        if (typeof data !== 'object') {
            this.renderSingleItem(tree, data)
        }

        this.container.appendChild(tree)
        this.toggle()
    }

    renderSingleItem(tree, data) {
        const li = document.createElement('li')
        li.innerText = data
        li.addEventListener('click', () => {
            const pathToRoot = data
            this.fbsDbPathSelected.emit(pathToRoot)
        })
        tree.appendChild(li)
    }

    createDbNameNode(name: string) {
        const li = document.createElement('li')
        const span = document.createElement('span')
        span.className = 'caret'
        span.innerText = name
        li.appendChild(span)
        return li
    }

    getTreePath(el) {
        const path = []
        path.push(el.innerText)

        while (el.parentNode) {
            el = el.parentNode
            if (el.tagName === 'UL') {
                const caretDown = el.querySelector('.caret-down')
                if (caretDown) {
                    for (let i = 0; i < el.children.length; i++) {
                        if (
                            el.children[i].nextSibling.innerText.indexOf(
                                path[path.length - 1]
                            ) !== -1
                        ) {
                            path.push(el.children[i].innerText)
                            break
                        }
                    }
                }
            }
            if (el.id === 'rootUl') {
                const truncated = []
                path.forEach(el => truncated.push(el.substring(0, el.length - 5)));

                return truncated.reverse().join(' -> ')
            }
        }
    }

    addRandom() {
        return `<span style="opacity:0">${Math.random().toFixed(2)}</span>`
    }

    createList(container: HTMLElement, obj, count: number = 0) {
        if (obj !== null) {
            if (!obj['info']) {
                const ul = document.createElement('ul')
                ul.className = 'nested'

                Object.entries(obj).forEach(([key, value]) => {
                    const isValueObject = typeof value == 'object'

                    if (isValueObject) {
                        const li = document.createElement('li')
                        const span = document.createElement('span')
                        span.className = 'caret'
                        span.innerHTML = `${key} ${this.addRandom()}`

                        li.appendChild(span)
                        ul.appendChild(li)
                    }

                    isValueObject
                        ? this.createList(ul, value, ++count)
                        : this.createList(ul, { info: { key, value } }, ++count)
                })

                const ulLi = document.createElement('li')
                ulLi.appendChild(ul)
                container.appendChild(ulLi)
            } else {
                let li = document.createElement('li')

                const { key, value } = obj.info
                li.innerHTML = `<strong> ${key}</strong>: ${value} ${this.addRandom()}`

                li.addEventListener('click', () => {
                    const pathToRoot = this.getTreePath(li)
                    this.fbsDbPathSelected.emit(pathToRoot)
                })
                container.appendChild(li)
            }
        }
    }

    render() {
        return (
            <Host class={{ 'error': this.error ? true : false }}>
                {this.error && <div class='error header'>{this.error}</div>}
                <div id="title">Firebase Database</div>
                <div ref={el => this.container = el} />
                {this.loading && <div class="header"><fbs-spinner /></div>}
            </Host>
        )
    }
}