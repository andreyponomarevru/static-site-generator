type Menu = {
  name: string;
  link: string;
}[];

export function buildMenu(menu: Menu) {
  return `
    <nav>
      ${menu.map(({ name, link }) => `<a href="${link}">${name}</a>`).join("")}
    </nav>`;
}
