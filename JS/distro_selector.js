import { load } from "./characters.js";

const arch_data = await (await fetch("linux_commands_arch.json")).json();
const debian_data = await (await fetch("linux_commands_debian.json")).json();
const nix_data = await (await fetch("linux_commands_nix.json")).json();
const gentoo_data = await (await fetch("linux_commands_gentoo.json")).json();
const fedora_data = await (await fetch("linux_commands_fedora.json")).json();
const kernel_data = await (await fetch("linux_commands_kernel.json")).json();

let current_data = kernel_data

export function get_current_data(){
    return current_data
}

export function update_data(){
    const par = document.getElementById("selectedDistro").parentElement;
    let cur = par.getElementsByTagName("p")[0]; //bad code but like there should only ever be one <p>
    switch(cur.innerHTML){
        case 'ARCH': current_data = arch_data; break;
        case 'DEBIAN': current_data = debian_data; break;
        case 'NIX': current_data = nix_data; break;
        case 'GENTOO': current_data = gentoo_data; break;
        case 'KERNEL': current_data = kernel_data; break;
        case 'FEDORA': current_data = fedora_data; break;
    }
}

let navbar = document.getElementById("Navbar");
function assign_listeners(){
    let buttons = navbar.querySelectorAll("button")
    for (let button of buttons) {
        button.addEventListener("click", function(){
            let cur = document.getElementById("selectedDistro")
            let divvington = document.createElement("div")
            divvington.id = cur.id
            cur.remove()
            button.appendChild(divvington)
            update_data()
            load()
        })
    }
}
assign_listeners()
