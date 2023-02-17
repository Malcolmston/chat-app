class Pils {
    constructor() {
      this.chip = document.createElement('div');
      this.chip.setAttribute('class', 'chip1');

      this.tooltip = document.createElement('div');
      this.tooltip.setAttribute('class', 'tooltip1');

      this.chip_head = document.createElement('div');
      this.chip_head.id = 'chip_head ';

      this.tooltiptext = document.createElement('span');
      this.tooltiptext.setAttribute('class', `tooltiptext1`);
      this.tooltiptext.id = 'tooltiptext ';

      this.chip_content = document.createElement('div');
      this.chip_content.setAttribute('class', 'chip-content1');

      this.chip_close = document.createElement('div');
      this.chip_close.setAttribute('class', 'chip-close1');

      this.chip_close.innerHTML = `<svg onclick='this.parentElement.parentElement.style.display='none'' class='chip-svg1' focusable='false' viewBox='0 0 24 24' aria-hidden='true'><path d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'></path></svg>`;
    }

    create_pil(stus, username, t = true) {
      this.chip_head.setAttribute('class', `chip-head1 ${stus}`);

      this.tooltiptext.innerText = stus;

      this.tooltip.append(this.chip_head, this.tooltiptext);

      this.chip_content.innerText = username;

      this.chip.append(this.tooltip, this.chip_content, this.chip_close);

      if (t) {
        document.querySelector('#allContentPeople').append(this.chip);
      } else {
        return this.chip;
      }
    }

    change_pil(stus) {
      //   this.className = ''
      this.chip_head.classList.add('chip-head1');
      this.chip_head.classList.add(stus);

      this.tooltiptext.innerText = stus;
    }

    change_pilFrom(element, stus) {
      // element.className = ''
      let chip_head = document.getElementById('chip_head');
      let tooltiptext = document.getElementById('tooltiptext');
      //tooltiptext
      chip_head.classList.add('chip-head1');
      chip_head.classList.add(stus);

      tooltiptext.innerText = stus;
    }
  }
