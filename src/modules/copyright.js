 const addCopyright = () => {
  const footer = document.createElement('footer');
  footer.innerHTML = `@ ${new Date().getFullYear()}Nkwain Bernice|Ngnayou Fabiola| Movie App`;
  document.body.appendChild(footer);
};
export { addCopyright };