import React from "react";

function Footer() {
    return (
        <footer class="bg-white rounded shadow p-5 mb-4 mt-4">
            <div class="row">
                <div class="col-12 col-md-4 col-xl-6 mb-4 mb-md-0">
                    <p class="mb-0 text-center text-lg-start">© 2023-<span class="current-year"></span> <a class="text-primary fw-normal" href="https://themesberg.com" target="_blank">Igor Machado - Cripto Bot</a></p>
                </div>
                <div class="col-12 col-md-8 col-xl-6 text-center text-lg-start">
                    <ul class="list-inline list-group-flush list-group-borderless text-md-end mb-0">
                        <li class="list-inline-item px-0 px-sm-2">
                            <a href="https://igormachado715.github.io/assets/about.html">About</a>
                        </li>
                        <li class="list-inline-item px-0 px-sm-2">
                            <a href="https://igormachado715.github.io/">Portfolio</a>
                        </li>
                        <li class="list-inline-item px-0 px-sm-2">
                            <a href="https://igormachado715.github.io/assets/projects.html">Projects</a>
                        </li>
                        <li class="list-inline-item px-0 px-sm-2">
                            <a href="https://igormachado715.github.io/assets/contact.html">Contact</a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer;