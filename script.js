let horariosOcupados = JSON.parse(localStorage.getItem('horarios')) || [];

const botoesAgendar = document.querySelectorAll('.btn-agendar');
const modal = document.querySelector('#modal-agendar');
const fechar = document.querySelector('.fechar');
const inputData = document.querySelector('#data');
const selectHora = document.querySelector('#hora');
const agendar = document.querySelector('#form-agendar');
const btn = document.getElementById("menu-btn");
const menu = document.querySelector("nav ul");

if (btn) {
    btn.addEventListener("click", () => {
        menu.classList.toggle("ativo");
  });
}

botoesAgendar.forEach(botao => {
    botao.addEventListener('click', e => {
        e.preventDefault();
        modal.classList.add('show');
        atualizarHorarios();
    });
});

modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('show');
});

if (fechar) {
    fechar.addEventListener('click', () => modal.classList.remove('show'));
}

inputData.addEventListener('change', function () {
    const data = this.value;
    const dataObj = new Date(data + 'T00:00');

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0,);

    if (dataObj < hoje) {
        alert('Não é possível agendar datas passadas.');
        this.value = '';
        return;
    }

    if (dataObj.getDay() === 0) {
        alert('Não atendemos aos domingos.');
        this.value = '';
        return;
    }

    atualizarHorarios();
});

function atualizarHorarios() {
    const dataSelecionada = inputData.value;

    Array.from(selectHora.options).forEach(option => {
        option.disabled = false;
    });

    if (!dataSelecionada) return;

    horariosOcupados.forEach(horario => {
        const [data, hora] = horario.split(' ');

        if (data === dataSelecionada) {
            const option = selectHora.querySelector(`option[value="${hora}"]`);
            if (option) option.disabled = true;
        }
    });
}

agendar.addEventListener('submit', function (event) {
    event.preventDefault();

    const servico = document.querySelector('#servico').value;
    const data = inputData.value;
    const hora = selectHora.value;

    if (!servico || !data || !hora) {
        alert('Preencha todos os campos!');
        return;
    }

    const horarioEscolhido = `${data} ${hora}`;

    if (horariosOcupados.includes(horarioEscolhido)) {
        alert('Este horário já está ocupado.');
        return;
    }

    horariosOcupados.push(horarioEscolhido);
    localStorage.setItem('horarios', JSON.stringify(horariosOcupados));

    const mensagem = `Olá! Quero agendar ${servico} no dia ${data} às ${hora}`;
    const url = `https://wa.me/5511911864401?text=${encodeURIComponent(mensagem)}`;

    window.open(url, '_blank');

    agendar.reset();
    modal.classList.remove('show');
});

const linksMenu = document.querySelectorAll("nav ul a");

linksMenu.forEach(link => {
    link.addEventListener("click", () => {
        menu.classList.remove("ativo");
    });
});
