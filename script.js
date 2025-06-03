document.addEventListener('DOMContentLoaded', () => {
    const botao = document.getElementById('gerarCuriosidade');
    const textoCuriosidade = document.getElementById('curiosidade');
    
    // Carrega as variáveis de ambiente
    async function carregarVariaveisAmbiente() {
        try {
            const response = await fetch('/.env');
            const text = await response.text();
            const envVars = {};
            
            text.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    envVars[key.trim()] = value.trim();
                }
            });
            
            return envVars;
        } catch (erro) {
            console.error('Erro ao carregar variáveis de ambiente:', erro);
            throw new Error('Não foi possível carregar as configurações da API');
        }
    }

    async function gerarCuriosidade() {
        try {
            botao.disabled = true;
            textoCuriosidade.textContent = 'Carregando...';

            const API_URL = `${config.API_URL}?key=${config.API_KEY}`;

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: "Me conte brevemente uma curiosidade sobre gatos"
                        }]
                    }]
                })
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                textoCuriosidade.textContent = data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Resposta inválida da API');
            }
        } catch (erro) {
            textoCuriosidade.textContent = 'Desculpe, ocorreu um erro ao buscar a curiosidade. Tente novamente.';
            console.error('Erro:', erro);
        } finally {
            botao.disabled = false;
        }
    }

    botao.addEventListener('click', gerarCuriosidade);
}); 