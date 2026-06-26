Abaixo está o PRD completo em Markdown, consolidando todas as decisões funcionais, técnicas e de experiência definidas até aqui.

# PRD — Pomodorus Focus

**Documento:** Product Requirements Document
**Produto:** Pomodorus Focus
**Versão:** 1.0
**Status:** Definição do MVP
**Plataforma inicial:** Aplicação web responsiva
**Idioma inicial:** Português do Brasil
**Modelo de arquitetura:** Aplicação monolítica com Next.js
**Última atualização:** 25 de junho de 2026

---

# 1. Resumo executivo

O **Pomodoros Focus** será uma aplicação web de gerenciamento de foco baseada na técnica Pomodoro, porém construída sobre uma premissa diferente das ferramentas tradicionais: cada período de foco ou descanso será um bloco independente, configurável e ordenável.

A maioria das aplicações Pomodoro trabalha com uma configuração fixa e repetitiva, como:

* 25 minutos de foco;
* 5 minutos de descanso;
* repetição automática desse mesmo padrão.

Mesmo quando essas ferramentas permitem personalização, normalmente o usuário continua limitado a definir apenas um tempo fixo de foco e um tempo fixo de descanso, que serão repetidos em todos os ciclos.

O Pomodorus Focus deverá permitir que o usuário crie uma rotina composta por blocos completamente independentes. Cada bloco poderá possuir:

* tipo próprio;
* título próprio;
* duração própria;
* posição própria dentro da rotina;
* background próprio;
* comportamento visual contextual.

Uma rotina poderá, por exemplo, ser configurada da seguinte forma:

1. Estudo de inglês — foco de 15 minutos;
2. Pausa para café — descanso de 5 minutos;
3. Desenvolvimento do projeto — foco de 3 horas;
4. Almoço — descanso de 1 hora;
5. Estudo técnico — foco de 1 hora e 30 minutos;
6. Pausa curta — descanso de 8 minutos;
7. Projeto pessoal — foco de 2 horas.

A aplicação também oferecerá um **Modo Tradicional**, destinado aos dias em que o usuário não quiser ou não puder seguir uma rotina previamente configurada. Nesse modo, o usuário informará:

* duração do foco;
* duração do descanso;
* quantidade de ciclos.

Embora existam duas formas de configuração, ambos os modos deverão utilizar o mesmo mecanismo interno de execução de blocos.

O MVP será uma aplicação autenticada, simples, monolítica e hospedada na Vercel. Cada usuário poderá salvar até cinco rotinas, cada rotina poderá possuir até cinquenta blocos, e somente uma sessão poderá estar ativa por vez no navegador atual.

---

# 2. Visão do produto

A visão do Pomodoros Focus é oferecer uma ferramenta de foco que se adapte à rotina real do usuário, em vez de exigir que o usuário adapte sua rotina a um modelo fixo de Pomodoro.

O produto deverá transmitir as seguintes características:

* flexibilidade;
* simplicidade;
* clareza;
* controle;
* concentração;
* previsibilidade;
* personalização visual;
* baixa fricção de uso.

O principal diferencial do produto não será apenas permitir alterar o tempo do Pomodoro, mas permitir que cada período seja configurado como uma unidade independente dentro de uma sequência.

---

# 3. Problema

As ferramentas tradicionais de Pomodoro normalmente trabalham com ciclos repetitivos e homogêneos.

Um usuário pode configurar, por exemplo:

* 40 minutos de foco;
* 10 minutos de descanso.

Ou pode personalizar esses valores para:

* 27 minutos de foco;
* 6 minutos de descanso.

Entretanto, depois de configurados, esses valores tendem a ser aplicados repetidamente a todos os ciclos.

Esse modelo não atende bem usuários que possuem rotinas variáveis, compostas por períodos de trabalho, estudo, descanso e atividades pessoais com durações diferentes ao longo do dia.

Uma rotina real pode conter:

* um bloco curto de estudo;
* uma pausa pequena;
* um bloco longo de desenvolvimento;
* uma pausa de almoço;
* outro bloco de estudo;
* um descanso de duração diferente;
* um último bloco de trabalho.

Nas ferramentas tradicionais, o usuário precisa:

* ajustar o timer manualmente a cada bloco;
* interromper o fluxo;
* lembrar qual atividade vem depois;
* utilizar mais de uma ferramenta;
* ignorar a estrutura fixa da aplicação;
* adaptar sua rotina à ferramenta.

O problema central é que as ferramentas existentes tratam foco e descanso como um padrão repetitivo, enquanto o Pomodoros Focus deverá tratá-los como blocos independentes dentro de uma rotina personalizada.

---

# 4. Solução proposta

O Pomodoros Focus permitirá que o usuário crie rotinas personalizadas formadas por uma sequência de blocos.

Cada bloco será tratado como uma unidade independente e deverá possuir, no mínimo:

* um tipo;
* um título;
* uma duração;
* uma posição na sequência;
* uma configuração visual de background.

Os tipos iniciais de bloco serão:

* foco;
* descanso.

A aplicação deverá executar os blocos em sequência, respeitando exatamente:

* a ordem definida pelo usuário;
* a duração definida para cada bloco;
* o título definido para cada bloco;
* o tipo definido para cada bloco;
* a configuração de avanço automático da rotina;
* a configuração de som do usuário.

A aplicação também deverá possuir um Modo Tradicional, no qual o usuário poderá criar uma sessão temporária informando:

* duração do foco;
* duração do descanso;
* quantidade de ciclos.

Internamente, o Modo Tradicional deverá gerar uma sequência temporária de blocos, utilizando o mesmo mecanismo de execução das rotinas personalizadas.

---

# 5. Objetivos do MVP

## 5.1. Objetivo principal

Permitir que um usuário autenticado crie, salve e execute rotinas temporizadas compostas por blocos independentes de foco e descanso.

## 5.2. Objetivos funcionais

O MVP deverá permitir que o usuário:

1. Faça login com Google ou GitHub.
2. Crie até cinco rotinas.
3. Dê um nome para cada rotina.
4. Adicione até cinquenta blocos em cada rotina.
5. Configure cada bloco de forma independente.
6. Escolha se um bloco será de foco ou descanso.
7. Dê um título próprio para cada bloco.
8. Configure a duração de cada bloco utilizando horas e minutos.
9. Configure uma cor ou background visual para cada bloco.
10. Reordene os blocos utilizando arrastar e soltar.
11. Reordene os blocos utilizando controles alternativos de subir e descer.
12. Edite uma rotina salva.
13. Exclua uma rotina salva.
14. Execute uma rotina salva.
15. Configure o avanço automático individualmente para cada rotina.
16. Utilize um Modo Tradicional.
17. Configure foco, descanso e quantidade de ciclos no Modo Tradicional.
18. Pause um bloco em execução.
19. Continue um bloco pausado.
20. Conclua antecipadamente um bloco e avance para o próximo.
21. Recarregue a página sem perder o estado do timer.
22. Mantenha o timer sincronizado entre diferentes abas do mesmo navegador.
23. Receba um alerta sonoro ao final de um bloco.
24. Ative ou desative o som.
25. Visualize uma tela de conclusão ao finalizar o último bloco.
26. Execute novamente uma rotina concluída.

## 5.3. Objetivos de experiência

O MVP deverá:

* manter a interface principal do timer limpa;
* evitar excesso de botões;
* deixar evidente qual bloco está em execução;
* deixar evidente qual será o próximo bloco;
* evitar perda de progresso após atualização da página;
* oferecer comportamento previsível;
* impedir que alterações em uma rotina modifiquem uma sessão já iniciada;
* permitir o uso por teclado;
* funcionar adequadamente em desktop e dispositivos móveis.

---

# 6. Não objetivos do MVP

Os seguintes itens não fazem parte do MVP:

* dashboard de produtividade;
* histórico de sessões;
* relatórios diários, semanais ou mensais;
* estatísticas de conclusão;
* metas de produtividade;
* conquistas ou gamificação;
* colaboração entre usuários;
* compartilhamento público de rotinas;
* sincronização de uma sessão entre diferentes dispositivos;
* execução simultânea de múltiplas sessões;
* notificações push;
* notificações por e-mail;
* integração com calendário;
* integração com gerenciadores de tarefas;
* imagens dinâmicas da Unsplash;
* seleção de imagens da Unsplash;
* upload de backgrounds personalizados;
* aplicativo nativo para celular;
* aplicativo desktop;
* funcionamento offline completo;
* modelagem definitiva do banco de dados;
* diferenciação entre bloco pulado e bloco concluído antecipadamente;
* configuração de duração utilizando segundos;
* edição de uma sessão já iniciada;
* múltiplos usuários compartilhando uma mesma rotina;
* repetição infinita de rotina;
* reinício automático da rotina ao concluir o último bloco;
* sons personalizados enviados pelo usuário.

Esses itens poderão ser reavaliados em versões futuras.

---

# 7. Público-alvo inicial

O público-alvo inicial será formado por pessoas que:

* utilizam a técnica Pomodoro;
* possuem uma rotina variável;
* alternam entre períodos de estudo, trabalho e descanso;
* consideram as ferramentas tradicionais excessivamente rígidas;
* desejam planejar previamente uma sequência de atividades;
* querem executar a rotina sem reajustar manualmente o timer a cada etapa;
* valorizam uma interface visualmente agradável;
* desejam controlar períodos longos e curtos dentro da mesma rotina.

Exemplos de usuários:

* desenvolvedores;
* estudantes;
* profissionais autônomos;
* criadores de conteúdo;
* profissionais que trabalham remotamente;
* pessoas que organizam o dia em blocos;
* pessoas que combinam trabalho, estudo e pausas em uma única sequência.

---

# 8. Princípios do produto

## 8.1. Cada bloco é independente

Nenhum bloco deverá herdar obrigatoriamente a duração do bloco anterior ou posterior.

Um bloco de foco poderá ter qualquer duração válida, independentemente da duração dos demais blocos de foco.

Um bloco de descanso poderá ter qualquer duração válida, independentemente da duração dos demais blocos de descanso.

## 8.2. A ordem é livre

A aplicação não deverá obrigar o usuário a alternar foco e descanso.

Serão válidas sequências como:

* foco, descanso, foco;
* foco, foco, descanso;
* descanso, foco, descanso;
* descanso, descanso, foco;
* qualquer outra sequência definida pelo usuário.

Um bloco de descanso não precisará possuir um bloco de foco anterior.

## 8.3. A execução deve ser previsível

O sistema deverá sempre indicar:

* qual bloco está em execução;
* quanto tempo falta;
* qual é a posição do bloco;
* quantos blocos existem na sessão;
* qual será o próximo bloco, quando houver.

## 8.4. A sessão iniciada deve ser estável

Depois que uma rotina for iniciada, a sessão deverá utilizar uma cópia dos blocos existentes naquele momento.

Alterações feitas posteriormente na rotina salva não poderão alterar:

* o bloco atual;
* a duração do bloco atual;
* os blocos seguintes da sessão em andamento;
* a ordem da sessão em andamento;
* os títulos da sessão em andamento;
* os backgrounds da sessão em andamento.

## 8.5. Simplicidade sólida

A aplicação deverá evitar complexidade visual ou funcional que não seja necessária para o funcionamento central do produto.

Simplicidade não deverá significar fragilidade.

Os principais comportamentos, especialmente timer, persistência, transição de blocos e sincronização entre abas, deverão ser implementados de forma robusta.

---

# 9. Conceitos do domínio

## 9.1. Rotina

Uma rotina é uma configuração salva pelo usuário contendo uma sequência ordenada de blocos.

Uma rotina deverá possuir:

* nome;
* lista de blocos;
* configuração de avanço automático;
* data de criação;
* data de última atualização.

Uma rotina poderá ser executada múltiplas vezes.

## 9.2. Bloco

Um bloco é uma unidade temporizada dentro de uma rotina ou sessão tradicional.

Cada bloco deverá possuir:

* tipo;
* título;
* duração;
* posição;
* configuração visual.

## 9.3. Bloco de foco

Representa um período destinado à execução de uma atividade de concentração.

Exemplos:

* Estudar inglês;
* Desenvolver autenticação;
* Revisar documentação;
* Escrever artigo;
* Resolver exercícios.

## 9.4. Bloco de descanso

Representa um período destinado a pausa, recuperação ou atividade intermediária.

Exemplos:

* Café;
* Almoço;
* Caminhada;
* Alongamento;
* Descanso curto;
* Pausa sem telas.

## 9.5. Sessão

Uma sessão representa a execução concreta de:

* uma rotina salva; ou
* uma sequência gerada pelo Modo Tradicional.

Somente uma sessão poderá estar ativa por vez no navegador atual.

## 9.6. Snapshot da sessão

O snapshot é uma cópia dos dados necessários para executar uma rotina sem depender de alterações futuras na rotina original.

O snapshot deverá ser criado quando o usuário iniciar a rotina.

A sessão deverá utilizar exclusivamente o snapshot até ser concluída ou substituída.

## 9.7. Modo Rotina

Modo no qual o usuário seleciona uma rotina previamente salva e executa seus blocos na ordem configurada.

## 9.8. Modo Tradicional

Modo no qual o usuário informa:

* duração de foco;
* duração de descanso;
* número de ciclos.

A aplicação deverá gerar uma sequência temporária alternando foco e descanso.

## 9.9. Ciclo no Modo Tradicional

Um ciclo tradicional será composto por:

1. um bloco de foco;
2. um bloco de descanso.

Quando o usuário selecionar mais de um ciclo, a aplicação deverá repetir esse padrão pela quantidade escolhida.

Exemplo de três ciclos:

1. Foco;
2. Descanso;
3. Foco;
4. Descanso;
5. Foco;
6. Descanso.

No MVP, o descanso do último ciclo continuará existindo. A interface deverá deixar a sequência explícita antes do início para evitar ambiguidade.

---

# 10. Escopo funcional

# 10.1. Autenticação

## 10.1.1. Login obrigatório

O usuário deverá estar autenticado para acessar as funcionalidades principais do produto.

Não haverá modo visitante no MVP.

Não haverá criação ou execução de rotina sem autenticação.

## 10.1.2. Provedores de autenticação

O sistema deverá oferecer autenticação por:

* Google;
* GitHub.

## 10.1.3. Tecnologia de autenticação

A autenticação deverá ser implementada utilizando Better Auth.

## 10.1.4. Comportamento de acesso

Ao acessar uma rota protegida sem autenticação, o usuário deverá ser redirecionado para a página de login.

Depois de concluir o login, o usuário deverá ser direcionado para a área principal da aplicação.

## 10.1.5. Logout

O usuário deverá poder encerrar sua autenticação por meio de uma ação disponível no menu da conta.

O logout não deverá ser acionado acidentalmente.

Caso exista uma sessão ativa no navegador no momento do logout, a aplicação deverá exibir uma confirmação informando que a sessão temporizada local deixará de estar acessível depois da saída.

---

# 10.2. Página inicial autenticada

A página inicial autenticada deverá apresentar:

* identificação do produto;
* acesso ao Modo Rotina;
* acesso ao Modo Tradicional;
* lista de rotinas salvas;
* quantidade de rotinas utilizadas;
* ação para criar uma nova rotina;
* acesso às configurações;
* acesso ao perfil;
* indicação de sessão ativa, quando houver.

A interface deverá mostrar claramente o limite de rotinas, por exemplo:

> 3 de 5 rotinas utilizadas

Quando o usuário ainda não possuir rotinas, deverá ser exibido um estado vazio com:

* explicação breve;
* botão para criar a primeira rotina;
* opção de utilizar o Modo Tradicional.

---

# 10.3. Gerenciamento de rotinas

## 10.3.1. Criação de rotina

O usuário deverá poder criar uma nova rotina desde que possua menos de cinco rotinas salvas.

Ao criar uma rotina, o sistema deverá solicitar:

* nome da rotina;
* configuração de avanço automático;
* pelo menos um bloco antes que a rotina possa ser salva como utilizável.

A rotina poderá ser construída gradualmente na tela de edição.

## 10.3.2. Limite de rotinas

Cada usuário poderá salvar no máximo cinco rotinas.

O limite deverá ser validado no backend.

A interface também deverá prevenir a tentativa de criação da sexta rotina.

Ao atingir o limite, a ação de criação deverá ficar indisponível ou apresentar uma mensagem clara:

> Você atingiu o limite de 5 rotinas. Exclua uma rotina existente para criar uma nova.

## 10.3.3. Nome da rotina

O nome da rotina será obrigatório.

O sistema deverá:

* remover espaços desnecessários no início e no final;
* impedir nomes compostos apenas por espaços;
* aplicar limite de caracteres;
* informar o limite visualmente;
* permitir nomes iguais, salvo decisão futura em contrário.

Sugestão inicial de limite:

* mínimo: 1 caractere válido;
* máximo: 80 caracteres.

## 10.3.4. Edição de rotina

O usuário deverá poder editar:

* nome da rotina;
* configuração de avanço automático;
* blocos;
* ordem dos blocos;
* título de cada bloco;
* tipo de cada bloco;
* duração de cada bloco;
* background de cada bloco.

Se a rotina estiver sendo executada em uma sessão ativa, a edição continuará permitida.

A tela deverá informar:

> Esta rotina está em execução. As alterações serão aplicadas somente na próxima vez que ela for iniciada. A sessão atual continuará utilizando a versão anterior.

A edição não deverá:

* reiniciar a sessão;
* alterar o timer em andamento;
* modificar o snapshot;
* alterar os blocos seguintes da sessão ativa;
* solicitar reset da sessão;
* apagar o progresso atual.

## 10.3.5. Exclusão de rotina

O usuário deverá poder excluir uma rotina salva.

A exclusão deverá exigir confirmação.

A confirmação deverá apresentar o nome da rotina e informar que a ação não poderá ser desfeita no MVP.

Se a rotina estiver sendo utilizada por uma sessão ativa, a exclusão da configuração salva poderá ser permitida, mas não deverá interromper a sessão, pois a sessão estará utilizando um snapshot independente.

A confirmação deverá informar:

> A rotina salva será excluída, mas a sessão que já está em andamento poderá continuar até o fim.

## 10.3.6. Duplicação

A duplicação de rotina não será obrigatória no MVP.

Caso seja implementada, deverá respeitar o limite de cinco rotinas.

---

# 10.4. Editor de rotina

## 10.4.1. Estrutura geral

O editor deverá apresentar:

* nome da rotina;
* configuração de avanço automático;
* lista ordenada de blocos;
* botão para adicionar bloco;
* contador de blocos;
* ação para salvar;
* ação para cancelar ou voltar;
* validações de preenchimento;
* resumo da duração total da rotina.

## 10.4.2. Limite de blocos

Cada rotina poderá possuir no máximo cinquenta blocos.

O limite deverá ser validado no backend.

A interface deverá mostrar, por exemplo:

> 18 de 50 blocos

Ao atingir cinquenta blocos:

* o botão de adicionar deverá ser desabilitado;
* deverá ser apresentada uma mensagem explicativa;
* blocos existentes continuarão editáveis;
* o usuário poderá excluir blocos para liberar espaço.

## 10.4.3. Adição de bloco

Ao adicionar um bloco, o sistema deverá criar um novo item editável.

O bloco poderá ser adicionado:

* ao final da lista;
* ou em uma posição específica, caso a interface ofereça essa opção.

O bloco novo deverá receber valores iniciais seguros, mas não deverá ser considerado válido até que os campos obrigatórios estejam preenchidos.

## 10.4.4. Campos do bloco

Cada bloco deverá possuir:

* tipo;
* título;
* duração em horas;
* duração em minutos;
* background;
* posição na rotina.

## 10.4.5. Tipo do bloco

O usuário poderá selecionar:

* Foco;
* Descanso.

A seleção deverá ser explícita.

O tipo deverá influenciar:

* rótulos visuais;
* ícone;
* texto de contexto;
* possíveis estilos padrão.

## 10.4.6. Título do bloco

Cada bloco deverá possuir um título obrigatório.

O título será exibido durante a execução.

Sugestão inicial de limite:

* mínimo: 1 caractere válido;
* máximo: 100 caracteres.

Exemplos:

* Estudar arquitetura de software;
* Pausa para café;
* Desenvolvimento do projeto;
* Almoço;
* Revisar anotações.

## 10.4.7. Duração do bloco

A duração deverá ser configurada utilizando horas e minutos.

Não haverá configuração por segundos.

A interface deverá possuir campos ou controles separados para:

* horas;
* minutos.

A duração final deverá ser calculada combinando os dois valores.

Exemplos válidos:

* 0 horas e 15 minutos;
* 1 hora e 0 minutos;
* 1 hora e 30 minutos;
* 3 horas e 5 minutos.

Não deverá ser permitido salvar um bloco com:

* 0 horas e 0 minutos;
* duração negativa;
* valores não numéricos;
* minutos fora do intervalo permitido;
* duração superior ao máximo definido.

Recomendação inicial:

* duração mínima: 1 minuto;
* duração máxima: 12 horas;
* horas permitidas: de 0 a 12;
* minutos permitidos: de 0 a 59;
* quando horas for 12, minutos deverá ser 0 para respeitar o máximo de 12 horas.

## 10.4.8. Remoção de bloco

O usuário deverá poder remover qualquer bloco.

A remoção deverá ser imediata apenas quando não houver risco relevante de perda acidental, ou deverá exigir confirmação quando o bloco possuir dados preenchidos.

Depois da remoção:

* os blocos restantes deverão ser reordenados;
* as posições deverão permanecer sequenciais;
* o contador de blocos deverá ser atualizado;
* a duração total deverá ser recalculada.

## 10.4.9. Reordenação por arrastar e soltar

O usuário deverá poder reorganizar blocos arrastando e soltando.

Durante a interação:

* o item arrastado deverá permanecer identificável;
* a posição de destino deverá ser visível;
* a lista deverá atualizar a ordem;
* a mudança deverá ser refletida no estado do formulário;
* a ordem final deverá ser salva.

## 10.4.10. Reordenação por botões

Além de arrastar e soltar, cada bloco deverá possuir ações acessíveis para:

* mover para cima;
* mover para baixo.

O primeiro bloco não deverá poder ser movido para cima.

O último bloco não deverá poder ser movido para baixo.

Os controles deverão possuir rótulos acessíveis, por exemplo:

* Mover bloco “Estudar inglês” para cima;
* Mover bloco “Pausa para café” para baixo.

## 10.4.11. Validação antes de salvar

A rotina não deverá ser salva como válida caso:

* não possua nome;
* não possua blocos;
* possua mais de cinquenta blocos;
* contenha um bloco sem título;
* contenha um bloco sem tipo;
* contenha um bloco com duração inválida;
* contenha um bloco com background inválido;
* ultrapasse limites definidos pelo sistema.

Os erros deverão ser mostrados próximos aos campos correspondentes.

Uma mensagem geral também deverá indicar que existem campos pendentes.

## 10.4.12. Duração total

O editor deverá calcular e exibir a duração total da rotina.

Exemplo:

> Duração total: 7 horas e 58 minutos

A duração total deverá ser recalculada sempre que:

* um bloco for adicionado;
* um bloco for removido;
* a duração de um bloco for alterada.

A ordem dos blocos não altera a duração total.

---

# 10.5. Configuração de avanço automático por rotina

Cada rotina deverá possuir sua própria configuração de avanço automático.

A configuração não será global para toda a conta.

Uma rotina poderá estar configurada para iniciar o próximo bloco automaticamente, enquanto outra poderá aguardar confirmação manual.

A opção deverá ser apresentada de forma clara no editor:

> Iniciar automaticamente o próximo bloco quando o bloco atual terminar

A configuração deverá possuir:

* estado habilitado;
* estado desabilitado;
* explicação resumida;
* valor persistido com a rotina.

## 10.5.1. Avanço automático habilitado

Quando habilitado:

1. O timer do bloco atual chega a zero.
2. O sistema marca o bloco como concluído.
3. O sistema reproduz o som, caso o som esteja habilitado.
4. O sistema identifica o próximo bloco.
5. O sistema apresenta uma transição visual curta.
6. O sistema inicia automaticamente o próximo bloco.
7. O novo timer passa a utilizar o tempo do bloco seguinte.

A transição visual deverá informar:

* que o bloco foi concluído;
* o título do próximo bloco;
* o tipo do próximo bloco;
* a duração do próximo bloco.

A transição não deverá exigir interação.

A duração sugerida da transição é de três segundos.

## 10.5.2. Avanço automático desabilitado

Quando desabilitado:

1. O timer do bloco atual chega a zero.
2. O sistema marca o bloco como concluído.
3. O sistema reproduz o som, caso esteja habilitado.
4. O sistema identifica o próximo bloco.
5. O sistema muda a sessão para o estado de espera.
6. O sistema mostra os dados do próximo bloco.
7. O sistema aguarda o usuário clicar em “Iniciar próximo bloco”.

Enquanto estiver aguardando:

* nenhum timer deverá estar correndo;
* o próximo bloco não deverá ser considerado iniciado;
* o usuário deverá visualizar claramente que a sessão está aguardando;
* o botão principal deverá ser “Iniciar próximo bloco”.

## 10.5.3. Último bloco

Se o bloco atual for o último da rotina, o sistema não deverá tentar iniciar outro bloco.

A sessão deverá ser concluída e a tela de conclusão deverá ser exibida.

---

# 10.6. Modo Tradicional

## 10.6.1. Objetivo

O Modo Tradicional permitirá iniciar uma sessão sem criar ou editar uma rotina permanente.

Ele será destinado a dias em que o usuário deseja utilizar um padrão simples e repetitivo.

## 10.6.2. Campos de configuração

O usuário deverá informar:

* duração do foco;
* duração do descanso;
* quantidade de ciclos;
* preferência de avanço automático para aquela configuração tradicional.

A duração deverá utilizar horas e minutos.

## 10.6.3. Duração de foco

A duração do foco deverá ser obrigatória.

Não poderá ser zero.

Deverá respeitar os mesmos limites válidos de um bloco de rotina.

## 10.6.4. Duração de descanso

A duração do descanso deverá ser obrigatória.

Não poderá ser zero.

Deverá respeitar os mesmos limites válidos de um bloco de rotina.

## 10.6.5. Quantidade de ciclos

A quantidade de ciclos deverá ser um número inteiro positivo.

O limite deverá impedir a geração de mais de cinquenta blocos.

Como cada ciclo gera dois blocos, a quantidade máxima inicial deverá ser de vinte e cinco ciclos.

A interface deverá informar quantos blocos serão gerados.

Exemplo:

> 5 ciclos gerarão 10 blocos.

## 10.6.6. Geração de blocos

Para cada ciclo, o sistema deverá gerar:

1. um bloco de foco;
2. um bloco de descanso.

Os títulos padrão poderão ser:

* Foco 1;
* Descanso 1;
* Foco 2;
* Descanso 2.

A sequência deverá ser apresentada no resumo antes do início.

## 10.6.7. Persistência da configuração tradicional

A sessão tradicional não será salva como uma das cinco rotinas.

A configuração poderá permanecer temporariamente no formulário durante a navegação da sessão atual, mas não deverá ocupar uma vaga de rotina.

Salvar uma configuração tradicional como rotina poderá ser considerado em uma versão futura.

---

# 10.7. Tela de preparação

Antes de iniciar uma rotina ou sessão tradicional, a aplicação deverá mostrar uma tela de preparação.

O timer não deverá começar imediatamente após o usuário selecionar uma rotina.

## 10.7.1. Conteúdo da tela

A tela de preparação deverá apresentar:

* nome da rotina ou indicação de Modo Tradicional;
* quantidade total de blocos;
* duração total;
* configuração de avanço automático;
* estado do som;
* resumo ordenado dos blocos;
* primeiro bloco;
* botão para iniciar;
* botão para voltar.

## 10.7.2. Resumo dos blocos

Cada item deverá apresentar:

* posição;
* tipo;
* título;
* duração.

Exemplo:

1. Foco — Estudar inglês — 15 minutos;
2. Descanso — Café — 5 minutos;
3. Foco — Desenvolvimento — 3 horas.

## 10.7.3. Início manual

O usuário deverá clicar em “Iniciar rotina” ou “Iniciar sessão”.

Apenas depois desse clique a contagem regressiva deverá começar.

## 10.7.4. Contagem regressiva

Depois do clique de início, a aplicação deverá apresentar uma contagem regressiva de três segundos:

* 3;
* 2;
* 1;
* iniciar.

Durante a contagem:

* o primeiro bloco ainda não deverá ter seu tempo consumido;
* o usuário deverá ver qual atividade começará;
* cliques repetidos no botão não deverão criar sessões duplicadas;
* o botão de início deverá ficar indisponível;
* a interface deverá prevenir duplo disparo.

Ao final da contagem:

* o primeiro bloco deverá entrar no estado de execução;
* o instante de início deverá ser registrado;
* o instante esperado de término deverá ser calculado;
* o timer deverá começar a ser exibido.

## 10.7.5. Cancelamento da contagem

No MVP, a contagem poderá ser cancelada por uma ação explícita, caso essa ação seja incluída.

Se não houver cancelamento explícito, sair da página durante a contagem não deverá criar uma sessão iniciada incorretamente.

---

# 10.8. Sessão ativa

## 10.8.1. Limite

Somente uma sessão poderá estar ativa por vez no navegador atual.

Esse limite se aplica tanto a:

* rotinas salvas;
* Modo Tradicional.

## 10.8.2. Início de uma nova sessão enquanto existe outra

Caso o usuário tente iniciar uma nova sessão enquanto já existe uma sessão ativa, o sistema deverá exibir uma confirmação.

A mensagem deverá informar:

* qual sessão está ativa;
* qual bloco está em andamento;
* que o progresso atual será substituído;
* que a ação não poderá ser desfeita no MVP.

Exemplo:

> Já existe uma sessão em andamento na rotina “Rotina da manhã”, atualmente no bloco “Estudar inglês”. Ao iniciar uma nova sessão, o progresso atual será descartado. Deseja continuar?

As ações deverão ser:

* Manter sessão atual;
* Substituir e iniciar nova sessão.

A opção visualmente mais segura deverá ser manter a sessão atual.

Ao confirmar a substituição:

1. o estado da sessão atual deverá ser removido;
2. a alteração deverá ser comunicada às outras abas;
3. a nova tela de preparação deverá ser apresentada;
4. a nova sessão só deverá começar depois do clique de início e da contagem regressiva.

## 10.8.3. Ausência de botão “Encerrar sessão”

A tela principal do timer não deverá possuir um botão permanente chamado:

* Encerrar sessão;
* Encerrar ciclo;
* Finalizar sessão.

A remoção desse botão tem como objetivo manter a interface principal mais limpa e evitar ambiguidade.

A substituição da sessão será tratada apenas quando o usuário tentar iniciar outra sessão.

## 10.8.4. Sessão limitada ao navegador atual

No MVP, uma sessão ativa não será sincronizada entre diferentes dispositivos.

Exemplos:

* uma sessão iniciada no computador não deverá aparecer automaticamente no celular;
* uma sessão iniciada no Chrome de um computador não deverá necessariamente aparecer em outro computador;
* o banco poderá conhecer configurações do usuário, mas a continuidade do timer será local.

A sincronização entre dispositivos será considerada fora do escopo.

---

# 10.9. Snapshot da rotina

## 10.9.1. Criação

Ao iniciar uma rotina, o sistema deverá criar uma cópia dos dados necessários para sua execução.

Essa cópia deverá incluir, no mínimo:

* identificação da rotina original;
* nome da rotina no momento do início;
* configuração de avanço automático;
* ordem dos blocos;
* tipo de cada bloco;
* título de cada bloco;
* duração de cada bloco;
* background de cada bloco.

## 10.9.2. Imutabilidade durante a sessão

O snapshot não deverá ser alterado quando:

* a rotina original for editada;
* a rotina original for renomeada;
* um bloco for adicionado à rotina original;
* um bloco for removido da rotina original;
* a duração de um bloco original for alterada;
* a ordem da rotina original for modificada;
* o background original for modificado;
* a rotina original for excluída.

## 10.9.3. Nova execução

Ao iniciar novamente a rotina, um novo snapshot deverá ser criado utilizando a versão mais recente da rotina salva.

## 10.9.4. Comunicação ao usuário

Quando uma rotina em execução for editada, a interface deverá explicar que as alterações só serão aplicadas em uma próxima execução.

O sistema não deverá oferecer reset automático da sessão após a edição.

---

# 10.10. Timer

## 10.10.1. Fonte de verdade temporal

O timer não deverá depender apenas de um contador decrementado por `setInterval`.

Durante a execução, o sistema deverá trabalhar com referências temporais, incluindo:

* instante de início;
* instante esperado de término;
* tempo restante ao pausar;
* instante de pausa;
* estado atual.

Enquanto o bloco estiver rodando, o tempo restante deverá ser calculado com base na diferença entre:

* horário esperado de término;
* horário atual.

## 10.10.2. Atualização visual

A interface poderá atualizar a exibição uma vez por segundo.

A atualização visual não será a fonte de verdade do tempo.

Caso uma atualização seja atrasada, o próximo cálculo deverá corrigir automaticamente a exibição.

## 10.10.3. Aba em segundo plano

Quando a página perder o foco ou a aba for colocada em segundo plano, o timer deverá continuar normalmente.

O sistema não deverá pausar automaticamente quando:

* o usuário troca de aba;
* o navegador é minimizado;
* a janela perde foco;
* o usuário acessa outra aplicação.

Ao voltar para a aba, o tempo deverá ser recalculado com base no horário real.

## 10.10.4. Bloqueio ou suspensão

Caso o navegador suspenda a execução de scripts temporariamente, o sistema deverá recalcular o tempo ao retomar.

Não deverá confiar na quantidade de eventos de intervalo que ocorreram.

## 10.10.5. Formato de exibição

O timer deverá exibir horas quando necessário.

Exemplos:

* `15:00` para quinze minutos;
* `01:30:00` para uma hora e trinta minutos;
* `03:00:00` para três horas.

O formato deverá permanecer visualmente estável.

A fonte deverá utilizar números tabulares sempre que possível.

---

# 10.11. Estados do timer

A sessão deverá trabalhar com estados explícitos.

## 10.11.1. `idle`

Representa uma sessão que ainda não iniciou seu primeiro bloco.

Pode ocorrer:

* na tela de preparação;
* antes da contagem regressiva;
* antes do primeiro início efetivo.

## 10.11.2. `countdown`

Representa a contagem regressiva de três segundos antes do início.

Durante esse estado:

* nenhum tempo do bloco é consumido;
* não existe bloco correndo;
* a interface exibe 3, 2 e 1.

## 10.11.3. `running`

Representa um bloco em execução.

Durante esse estado:

* o tempo está sendo consumido;
* existe um horário esperado de término;
* o botão principal é “Pausar”;
* a ação secundária é “Concluir e avançar”.

## 10.11.4. `paused`

Representa um bloco pausado manualmente.

Durante esse estado:

* o tempo não é consumido;
* o tempo restante permanece congelado;
* o botão principal é “Continuar”;
* a ação “Concluir e avançar” continua disponível.

## 10.11.5. `transitioning`

Representa a transição curta entre dois blocos quando o avanço automático está habilitado.

Durante esse estado:

* o bloco anterior já foi concluído;
* o próximo bloco ainda está sendo apresentado;
* a interface exibe informações do próximo bloco;
* não deverá haver interação que gere início duplicado.

## 10.11.6. `waiting`

Representa a espera manual pelo início do próximo bloco.

Esse estado será utilizado quando o avanço automático estiver desabilitado.

Durante esse estado:

* nenhum timer está correndo;
* o próximo bloco está preparado;
* o botão principal é “Iniciar próximo bloco”.

## 10.11.7. `completed`

Representa uma sessão cujo último bloco foi concluído.

Durante esse estado:

* não existe timer em execução;
* a tela de conclusão é exibida;
* a sessão não é mais considerada ativa;
* o usuário poderá executar novamente.

---

# 10.12. Controles durante a execução

## 10.12.1. Pausar

Quando o bloco estiver em execução, deverá existir um botão principal chamado “Pausar”.

Ao clicar:

1. o sistema calcula o tempo restante;
2. o sistema salva o tempo restante;
3. o sistema altera o estado para pausado;
4. o timer visual para de diminuir;
5. a mudança é comunicada às outras abas.

## 10.12.2. Continuar

Quando o bloco estiver pausado, o botão principal deverá mudar para “Continuar”.

Ao clicar:

1. o sistema utiliza o tempo restante salvo;
2. calcula um novo horário esperado de término;
3. altera o estado para execução;
4. retoma o timer;
5. comunica a mudança às outras abas.

## 10.12.3. Concluir e avançar

Durante os estados `running` e `paused`, deverá existir uma ação secundária chamada “Concluir e avançar”.

Essa ação deverá:

1. encerrar o bloco atual antes do tempo previsto;
2. considerar o bloco concluído;
3. não distinguir entre “pulado” e “concluído antecipadamente”;
4. identificar o próximo bloco;
5. avançar para o próximo bloco.

Como o usuário escolheu não diferenciar bloco pulado de bloco concluído antecipadamente, o MVP deverá tratar ambas as intenções como uma única ação.

## 10.12.4. Comportamento de “Concluir e avançar”

Quando houver um próximo bloco, clicar em “Concluir e avançar” deverá iniciar o próximo bloco sem depender da configuração de avanço automático.

A ação é explícita e significa que o usuário deseja concluir o bloco atual e avançar imediatamente.

O sistema deverá:

* apresentar uma transição curta;
* iniciar o próximo bloco;
* reproduzir ou não o som conforme decisão de experiência.

No MVP, recomenda-se não reproduzir o som de término ao clicar manualmente em “Concluir e avançar”, pois o usuário já recebeu confirmação visual através da própria ação. O som ficará reservado ao término natural do timer.

## 10.12.5. Último bloco

Se o usuário clicar em “Concluir e avançar” durante o último bloco:

* o bloco deverá ser concluído;
* a sessão deverá ser marcada como concluída;
* a tela de conclusão deverá ser exibida;
* nenhuma nova sessão deverá começar.

## 10.12.6. Hierarquia visual

A interface não deverá apresentar todos os controles com o mesmo peso.

Recomendação:

* botão principal: Pausar ou Continuar;
* botão secundário: Concluir e avançar.

Não haverá botão permanente de encerramento.

---

# 10.13. Comportamento quando o bloco termina naturalmente

## 10.13.1. Detecção de término

Um bloco termina naturalmente quando o horário atual é igual ou posterior ao horário esperado de término.

O sistema deverá impedir que o término seja processado mais de uma vez.

## 10.13.2. Som

Ao término natural:

* o som deverá ser reproduzido caso esteja habilitado;
* o som não deverá ser reproduzido caso esteja desabilitado;
* uma falha de reprodução não deverá impedir o avanço da sessão.

## 10.13.3. Avanço automático habilitado

Quando houver próximo bloco:

1. concluir o bloco atual;
2. reproduzir o som;
3. mostrar a transição;
4. iniciar o próximo bloco automaticamente.

## 10.13.4. Avanço automático desabilitado

Quando houver próximo bloco:

1. concluir o bloco atual;
2. reproduzir o som;
3. mudar para o estado de espera;
4. mostrar o próximo bloco;
5. aguardar o usuário.

## 10.13.5. Último bloco

Quando não houver próximo bloco:

1. concluir o bloco atual;
2. reproduzir o som;
3. concluir a sessão;
4. mostrar a tela final.

---

# 10.14. Persistência do estado

## 10.14.1. Objetivo

Atualizar a página com F5 não poderá apagar ou reiniciar o timer atual.

## 10.14.2. Persistência local

A sessão ativa deverá ser salva localmente no navegador.

A persistência deverá incluir os dados necessários para reconstruir:

* snapshot;
* bloco atual;
* posição atual;
* estado;
* tempo restante;
* horário de início;
* horário esperado de término;
* configuração de avanço automático;
* configuração visual;
* identificação da sessão.

Poderá ser utilizado:

* `localStorage`;
* IndexedDB;
* outra solução local equivalente.

Para o MVP, `localStorage` poderá ser suficiente desde que:

* os dados sejam pequenos;
* exista validação;
* exista tratamento de corrupção;
* os acessos sejam encapsulados;
* não sejam armazenadas informações sensíveis.

## 10.14.3. Restauração após F5

Ao carregar a aplicação, o sistema deverá verificar se existe uma sessão ativa local.

Caso exista, deverá:

1. validar a estrutura salva;
2. identificar o estado;
3. recalcular o tempo;
4. restaurar a sessão;
5. apresentar a tela apropriada.

## 10.14.4. Recarregamento durante execução e bloco ainda válido

Caso o bloco ainda não tenha terminado:

* o tempo restante deverá ser recalculado;
* o timer deverá continuar;
* o bloco não deverá reiniciar;
* a duração original não deverá ser restaurada integralmente.

## 10.14.5. Recarregamento após o horário de término

Caso o usuário recarregue ou retorne à aplicação depois que o bloco já deveria ter terminado, será utilizado o seguinte comportamento:

1. o sistema detecta que o horário esperado de término já passou;
2. o sistema conclui somente o bloco que estava em execução;
3. o sistema não calcula todos os blocos que poderiam ter ocorrido durante a ausência;
4. o sistema não marca vários blocos como concluídos;
5. o sistema identifica o próximo bloco;
6. o sistema inicia o próximo bloco no momento em que o usuário retorna;
7. o novo bloco recebe sua duração integral;
8. o horário esperado de término é calculado a partir do retorno do usuário.

Esse comportamento se aplica quando o avanço automático da rotina está habilitado.

Exemplo:

* o bloco atual terminaria às 14h;
* o usuário retorna às 14h20;
* o sistema conclui o bloco anterior;
* inicia apenas o próximo bloco às 14h20;
* não tenta simular vinte minutos de execução em segundo plano;
* não avança mais de um bloco.

Quando o avanço automático estiver desabilitado:

* o bloco anterior deverá ser concluído;
* o sistema deverá entrar no estado de espera;
* o próximo bloco só começará após interação do usuário.

## 10.14.6. Recarregamento durante pausa

Caso a página seja atualizada com o bloco pausado:

* o estado deverá continuar pausado;
* o tempo restante deverá permanecer igual;
* o timer não deverá ser retomado automaticamente.

## 10.14.7. Recarregamento durante espera

Caso a página seja atualizada no estado de espera:

* o próximo bloco deverá continuar aguardando;
* o timer não deverá começar sozinho.

## 10.14.8. Dados inválidos

Caso o estado salvo esteja corrompido ou incompatível:

* a aplicação não deverá quebrar;
* o estado inválido deverá ser descartado de forma segura;
* o usuário deverá receber uma mensagem;
* nenhuma rotina salva deverá ser excluída.

---

# 10.15. Sincronização entre abas com BroadcastChannel

## 10.15.1. Objetivo

Quando o usuário abrir a aplicação em mais de uma aba no mesmo navegador, todas as abas deverão refletir a mesma sessão ativa.

## 10.15.2. Tecnologia

A sincronização deverá utilizar `BroadcastChannel` quando suportado.

## 10.15.3. Eventos sincronizados

As abas deverão comunicar, no mínimo:

* início de sessão;
* início de bloco;
* pausa;
* retomada;
* conclusão manual;
* término natural;
* avanço de bloco;
* substituição de sessão;
* conclusão da sessão;
* alteração do estado persistido.

## 10.15.4. Fonte de verdade

O estado persistido localmente deverá ser utilizado em conjunto com as mensagens do canal.

As mensagens deverão servir para notificar outras abas de que o estado mudou.

Cada aba deverá reler ou validar o estado atualizado.

## 10.15.5. Prevenção de ações duplicadas

O sistema deverá reduzir o risco de duas abas processarem simultaneamente o término do mesmo bloco.

As ações de transição deverão ser idempotentes.

Cada bloco ou estado deverá possuir informações suficientes para identificar se o término já foi processado.

## 10.15.6. Conflitos

Caso duas abas executem ações diferentes quase simultaneamente, o sistema deverá adotar uma estratégia determinística.

Para o MVP, poderá ser utilizado:

* identificador único de sessão;
* versão incremental do estado;
* timestamp de atualização;
* comparação antes de persistir.

A implementação deverá evitar que uma atualização antiga sobrescreva uma atualização mais recente.

## 10.15.7. Navegadores sem suporte

Caso `BroadcastChannel` não esteja disponível:

* o timer deverá continuar funcionando em uma aba;
* a persistência por F5 deverá continuar funcionando;
* poderá ser utilizado o evento `storage` como fallback;
* a ausência do canal não deverá impedir o uso do produto.

---

# 10.16. Configuração de som

## 10.16.1. Preferência do usuário

O usuário deverá poder:

* habilitar o som;
* desabilitar o som.

A preferência deverá ser persistida.

## 10.16.2. Momento de reprodução

No MVP, o som deverá ser reproduzido apenas quando um bloco terminar naturalmente.

Não deverão existir sons obrigatórios para:

* início do bloco;
* pausa;
* retomada;
* contagem regressiva;
* conclusão manual;
* abertura da aplicação.

## 10.16.3. Restrições do navegador

Navegadores podem impedir reprodução automática de áudio antes de uma interação do usuário.

A aplicação deverá preparar o áudio depois de uma interação válida, como:

* clicar em iniciar;
* clicar em ativar som.

Se o navegador bloquear o áudio:

* o fluxo do timer deverá continuar;
* a aplicação poderá informar que o som foi bloqueado;
* o usuário deverá receber orientação para habilitar áudio no navegador.

## 10.16.4. Teste de som

A página de configurações deverá oferecer uma ação “Testar som”.

O teste deverá respeitar o volume definido, caso o volume seja configurável.

## 10.16.5. Volume

O MVP poderá utilizar volume fixo ou permitir controle simples.

Caso seja implementado controle:

* valor mínimo: silencioso;
* valor máximo: volume padrão seguro;
* a preferência deverá ser salva.

A presença de controle de volume não deverá substituir a opção explícita de habilitar ou desabilitar.

---

# 10.17. Backgrounds e identidade visual

## 10.17.1. Unsplash

A integração com a API da Unsplash não fará parte do MVP.

Ela deverá ser considerada para uma segunda fase.

## 10.17.2. Opções iniciais

No MVP, o usuário deverá poder escolher backgrounds fornecidos pela própria aplicação.

As opções poderão incluir:

* cores sólidas;
* gradientes;
* tema roxo futurista;
* variações visuais pré-configuradas.

## 10.17.3. Background por bloco

Cada bloco poderá possuir seu próprio background.

Ao mudar de bloco, o background deverá mudar de acordo com a configuração do novo bloco.

## 10.17.4. Fallback roxo futurista

Caso o background configurado não possa ser carregado ou seja inválido, a aplicação deverá utilizar um fallback roxo com efeitos futuristas.

O fallback deverá ser produzido preferencialmente com CSS, utilizando recursos como:

* gradientes;
* iluminação difusa;
* blur;
* formas abstratas;
* overlays;
* efeitos sutis de profundidade.

A aplicação não deverá depender de uma imagem externa para renderizar o fallback.

## 10.17.5. Preferência global

Nas configurações, o usuário deverá poder escolher um background padrão.

Esse padrão poderá ser usado:

* em novos blocos;
* em blocos sem configuração específica;
* em estados genéricos;
* como fallback.

## 10.17.6. Legibilidade

Todo background deverá receber tratamento para garantir a leitura do conteúdo.

A aplicação deverá utilizar, quando necessário:

* overlay escuro;
* overlay claro;
* sombra;
* blur localizado;
* contraste reforçado;
* painel translúcido.

O timer, o título e os controles deverão permanecer legíveis.

---

# 10.18. Tela do timer

## 10.18.1. Informações obrigatórias

A tela deverá apresentar:

* nome da rotina ou Modo Tradicional;
* tipo do bloco;
* título do bloco;
* tempo restante;
* posição atual;
* quantidade total de blocos;
* próximo bloco, quando houver;
* estado atual;
* controles disponíveis.

## 10.18.2. Hierarquia

O elemento de maior destaque deverá ser o tempo restante.

Em seguida:

* título do bloco;
* tipo;
* progresso da sequência;
* controles.

## 10.18.3. Exemplo de apresentação

```text
Rotina da manhã

FOCO
Estudar arquitetura de software

01:30:00

Bloco 3 de 8
Próximo: Pausa para café — 10 minutos

[ Pausar ] [ Concluir e avançar ]
```

## 10.18.4. Estado pausado

Quando pausado:

* deverá existir indicação visual clara;
* o timer deverá permanecer visível;
* o botão principal deverá mudar para “Continuar”;
* o background poderá receber um efeito sutil que comunique pausa;
* a interface não deverá parecer concluída.

## 10.18.5. Estado de espera

Quando estiver aguardando o próximo bloco:

* o bloco concluído não deverá continuar aparentando estar ativo;
* o próximo bloco deverá ser apresentado;
* o botão principal deverá ser “Iniciar próximo bloco”;
* a interface deverá informar que o avanço automático está desabilitado.

## 10.18.6. Progresso

A aplicação poderá apresentar:

* `Bloco 3 de 8`;
* barra de progresso da sequência;
* indicação visual dos blocos concluídos.

O progresso não deverá ser confundido com o progresso temporal do bloco atual.

---

# 10.19. Tela de conclusão

## 10.19.1. Exibição

Ao concluir o último bloco, a aplicação deverá apresentar uma tela de conclusão.

## 10.19.2. Conteúdo

A tela deverá mostrar:

* nome da rotina ou Modo Tradicional;
* mensagem de conclusão;
* quantidade de blocos concluídos;
* duração planejada da sessão;
* ação para executar novamente;
* ação para voltar à página inicial.

Como não haverá histórico no MVP, essas informações poderão ser calculadas a partir da sessão concluída e não precisarão permanecer disponíveis depois que o usuário sair da tela.

## 10.19.3. Executar novamente

Ao clicar em “Executar novamente”:

* para uma rotina salva, a aplicação deverá buscar a versão mais recente da rotina;
* um novo snapshot deverá ser criado;
* a tela de preparação deverá ser mostrada novamente;
* a sessão não deverá iniciar imediatamente;
* o usuário deverá clicar em iniciar;
* a contagem regressiva de três segundos deverá ocorrer.

Para o Modo Tradicional:

* a configuração anterior poderá ser reapresentada;
* o usuário poderá revisar antes de iniciar;
* uma nova sessão deverá ser criada apenas após confirmação.

## 10.19.4. Sem repetição automática

A rotina não deverá reiniciar automaticamente ao terminar.

Não deverá existir repetição infinita no MVP.

---

# 11. Regras de negócio

## RN-001 — Autenticação obrigatória

Nenhuma funcionalidade principal de criação, edição ou execução deverá estar disponível sem autenticação.

## RN-002 — Limite de rotinas

Um usuário poderá possuir no máximo cinco rotinas salvas.

## RN-003 — Limite de blocos

Uma rotina poderá possuir no máximo cinquenta blocos.

## RN-004 — Rotina válida

Uma rotina precisa possuir:

* nome válido;
* pelo menos um bloco válido;
* no máximo cinquenta blocos.

## RN-005 — Bloco válido

Um bloco precisa possuir:

* tipo válido;
* título válido;
* duração válida;
* posição válida;
* background válido ou fallback aplicável.

## RN-006 — Tipos permitidos

Os tipos permitidos no MVP são:

* foco;
* descanso.

## RN-007 — Ordem livre

Qualquer combinação de foco e descanso será permitida.

## RN-008 — Duração

A duração será configurada em horas e minutos.

Não serão aceitos segundos.

## RN-009 — Duração mínima

Cada bloco deverá possuir pelo menos um minuto.

## RN-010 — Duração máxima

Cada bloco poderá possuir no máximo doze horas.

## RN-011 — Uma sessão ativa

Somente uma sessão poderá estar ativa por vez no navegador atual.

## RN-012 — Snapshot

Uma sessão iniciada deverá utilizar um snapshot independente da rotina original.

## RN-013 — Edição sem impacto

Editar uma rotina não deverá modificar a sessão que já está em andamento.

## RN-014 — Avanço por rotina

A configuração de avanço automático deverá pertencer individualmente a cada rotina.

## RN-015 — Concluir e avançar

A ação “Concluir e avançar” não deverá diferenciar bloco pulado de bloco concluído antecipadamente.

## RN-016 — Sem encerramento permanente

A tela do timer não deverá possuir botão permanente de encerramento da sessão.

## RN-017 — Continuidade em segundo plano

Trocar de aba não pausa o timer.

## RN-018 — Persistência

Atualizar a página não deverá reiniciar a sessão.

## RN-019 — Retorno tardio

Ao retornar depois que um bloco terminou, o sistema deverá processar somente o bloco que estava ativo e não simular múltiplos blocos transcorridos.

## RN-020 — Som

O som deverá ocorrer apenas no término natural de um bloco, quando habilitado.

## RN-021 — Sem histórico

O MVP não deverá oferecer histórico ou relatórios de produtividade.

## RN-022 — Sem sincronização entre dispositivos

A sessão ativa não deverá ser sincronizada entre diferentes dispositivos no MVP.

## RN-023 — Conclusão final

O último bloco deverá levar a uma tela de conclusão.

## RN-024 — Preparação obrigatória

Selecionar uma rotina não deverá iniciar imediatamente o timer.

## RN-025 — Contagem regressiva

Toda sessão deverá iniciar após uma contagem regressiva de três segundos.

---

# 12. Fluxos principais

# 12.1. Fluxo de criação de rotina

1. Usuário acessa a área autenticada.
2. Usuário clica em “Nova rotina”.
3. Sistema verifica o limite de cinco rotinas.
4. Sistema abre o editor.
5. Usuário informa o nome.
6. Usuário escolhe o avanço automático.
7. Usuário adiciona um bloco.
8. Usuário escolhe o tipo.
9. Usuário informa o título.
10. Usuário informa horas e minutos.
11. Usuário escolhe o background.
12. Usuário adiciona outros blocos.
13. Usuário reordena os blocos.
14. Sistema recalcula a duração total.
15. Usuário clica em salvar.
16. Sistema valida todos os dados.
17. Sistema persiste a rotina.
18. Sistema retorna à lista.
19. Nova rotina aparece disponível.

# 12.2. Fluxo de execução de rotina

1. Usuário seleciona uma rotina.
2. Sistema abre a tela de preparação.
3. Sistema mostra o resumo completo.
4. Usuário revisa os blocos.
5. Usuário clica em “Iniciar rotina”.
6. Sistema verifica se existe sessão ativa.
7. Se existir, solicita confirmação de substituição.
8. Sistema cria o snapshot.
9. Sistema inicia contagem de três segundos.
10. Sistema inicia o primeiro bloco.
11. Timer entra em execução.
12. Usuário pausa, retoma ou conclui antecipadamente conforme necessário.
13. Sistema avança pelos blocos.
14. Último bloco termina.
15. Sistema apresenta a tela de conclusão.

# 12.3. Fluxo de edição durante sessão ativa

1. Usuário possui uma rotina em execução.
2. Usuário abre o editor da mesma rotina.
3. Sistema informa que a edição não afetará a sessão atual.
4. Usuário altera a rotina.
5. Usuário salva.
6. Rotina salva recebe as alterações.
7. Snapshot da sessão permanece intacto.
8. Sessão continua sem reset.
9. Na próxima execução, a versão nova será utilizada.

# 12.4. Fluxo de Modo Tradicional

1. Usuário acessa o Modo Tradicional.
2. Informa duração do foco.
3. Informa duração do descanso.
4. Informa quantidade de ciclos.
5. Escolhe avanço automático.
6. Sistema valida os valores.
7. Sistema gera a sequência temporária.
8. Sistema mostra a tela de preparação.
9. Usuário revisa os blocos.
10. Usuário clica em iniciar.
11. Sistema verifica se existe sessão ativa.
12. Sistema substitui apenas após confirmação.
13. Contagem regressiva é exibida.
14. Primeiro bloco inicia.
15. A sequência é executada.
16. Tela de conclusão é exibida.

# 12.5. Fluxo de F5 durante execução

1. Bloco está rodando.
2. Estado local contém o snapshot e referências temporais.
3. Usuário atualiza a página.
4. Aplicação inicia.
5. Aplicação encontra o estado salvo.
6. Aplicação valida o estado.
7. Aplicação compara horário atual e horário esperado.
8. Se o bloco ainda estiver válido, recalcula o restante.
9. Timer reaparece com o tempo correto.
10. A sessão continua.

# 12.6. Fluxo de retorno após término

1. Usuário inicia um bloco.
2. Aba fica suspensa ou página é fechada.
3. Horário esperado de término passa.
4. Usuário retorna.
5. Sistema detecta atraso.
6. Sistema conclui o bloco anterior.
7. Sistema não processa vários blocos.
8. Se avanço automático estiver habilitado, inicia apenas o próximo bloco a partir do retorno.
9. Se estiver desabilitado, entra no estado de espera.

# 12.7. Fluxo entre duas abas

1. Usuário abre a aplicação em duas abas.
2. Ambas detectam a mesma sessão local.
3. Usuário pausa na primeira aba.
4. Primeira aba persiste o novo estado.
5. Primeira aba emite mensagem pelo `BroadcastChannel`.
6. Segunda aba recebe a mensagem.
7. Segunda aba relê o estado.
8. Segunda aba apresenta a sessão pausada.
9. Nenhuma aba continua exibindo estado antigo.

---

# 13. Requisitos não funcionais

# 13.1. Confiabilidade

O sistema deverá:

* recuperar a sessão após F5;
* evitar processamento duplicado de término;
* impedir criação duplicada por duplo clique;
* utilizar cálculos temporais baseados em timestamps;
* tratar estados locais inválidos;
* manter a sessão estável após edição da rotina original;
* garantir transições idempotentes;
* sincronizar alterações relevantes entre abas.

# 13.2. Performance

Metas iniciais:

* páginas principais carregando rapidamente em conexão comum;
* interação do timer sem atrasos perceptíveis;
* atualização visual do timer sem travar a interface;
* backgrounds sem bloquear o conteúdo principal;
* persistência local executada sem congelar a interface;
* carregamento progressivo de recursos não essenciais.

O timer deverá possuir prioridade sobre efeitos visuais.

# 13.3. Responsividade

A aplicação deverá funcionar em:

* desktop;
* notebook;
* tablet;
* celular.

A tela do timer deverá permanecer utilizável em telas pequenas.

Os botões principais deverão possuir área de toque adequada.

# 13.4. Acessibilidade

A aplicação deverá:

* utilizar HTML semântico;
* permitir navegação por teclado;
* possuir foco visível;
* fornecer rótulos acessíveis;
* manter contraste adequado;
* não depender apenas de cor;
* respeitar `prefers-reduced-motion`;
* permitir uso dos botões de reordenação sem arrastar e soltar;
* utilizar textos compreensíveis;
* evitar animações excessivas;
* manter o timer legível para tecnologias assistivas.

A atualização do timer não deverá fazer leitores de tela anunciarem cada segundo de forma intrusiva.

Eventos importantes, como término do bloco, poderão utilizar uma região `aria-live` apropriada.

# 13.5. Segurança

O sistema deverá:

* proteger todas as rotas autenticadas;
* validar propriedade das rotinas;
* nunca confiar apenas no identificador enviado pelo frontend;
* validar dados no servidor;
* impedir que um usuário leia ou altere rotinas de outro;
* manter segredos somente no servidor;
* utilizar cookies seguros conforme o ambiente;
* aplicar proteção adequada contra CSRF conforme a estratégia do Better Auth;
* escapar ou sanitizar conteúdo exibido;
* limitar tamanhos de entrada;
* não armazenar tokens de autenticação no estado comum da aplicação.

# 13.6. Privacidade

O MVP deverá coletar apenas os dados necessários para:

* autenticação;
* identificação do usuário;
* armazenamento das rotinas;
* preferências do produto.

Não deverá coletar conteúdo desnecessário sobre produtividade.

Como não haverá histórico, sessões concluídas não precisarão ser mantidas como registros analíticos do usuário.

# 13.7. Compatibilidade

O produto deverá priorizar versões modernas de:

* Google Chrome;
* Microsoft Edge;
* Mozilla Firefox;
* Safari.

Funcionalidades baseadas em `BroadcastChannel` deverão possuir fallback ou degradação segura.

# 13.8. Observabilidade

A aplicação deverá registrar erros técnicos relevantes, sem incluir dados sensíveis.

Os logs poderão incluir:

* falha ao restaurar sessão;
* falha ao salvar rotina;
* falha de autenticação;
* falha de sincronização;
* falha ao reproduzir áudio;
* exceções de timer;
* falha ao validar estado local.

Recomenda-se utilizar Sentry ou solução equivalente.

# 13.9. Disponibilidade

Uma falha em recursos secundários não deverá impedir o timer.

Exemplos:

* falha no background utiliza fallback;
* falha no áudio não impede avanço;
* falha de animação não impede transição;
* falha do `BroadcastChannel` não impede o uso em uma única aba.

---

# 14. Stack tecnológica proposta

## 14.1. Aplicação

* Next.js;
* App Router;
* TypeScript;
* arquitetura monolítica.

## 14.2. Interface

* React;
* Tailwind CSS;
* shadcn/ui;
* React Hook Form;
* Zod.

## 14.3. Autenticação

* Better Auth;
* Google;
* GitHub.

## 14.4. Banco de dados

A aplicação será hospedada na Vercel.

Não deverá utilizar um arquivo SQLite local como banco persistente dentro do filesystem da Vercel.

A recomendação principal é:

* Turso;
* libSQL;
* Drizzle ORM.

Essa combinação preserva uma experiência semelhante ao SQLite, mas utiliza um banco remoto adequado para ambiente serverless.

Alternativa futura:

* Neon PostgreSQL;
* Drizzle ORM.

## 14.5. Persistência da sessão local

* `localStorage` ou IndexedDB;
* `BroadcastChannel`;
* evento `storage` como possível fallback.

## 14.6. Testes

* Vitest para testes unitários;
* Testing Library para componentes;
* Playwright para testes end-to-end.

## 14.7. Monitoramento

* Sentry ou solução equivalente;
* logs estruturados da Vercel.

## 14.8. Hospedagem

* Vercel.

---

# 15. Direção visual

## 15.1. Estética

A identidade deverá combinar:

* sofisticação editorial;
* visual moderno;
* atmosfera focada;
* elementos futuristas;
* boa legibilidade.

## 15.2. Tipografia

Para títulos de destaque, recomenda-se:

* Abril Fatface.

Alternativas:

* Playfair Display em peso Black ou 900;
* Yeseva One.

Para a interface:

* Geist;
* Inter;
* Manrope.

Para o timer:

* Geist Mono;
* outra fonte com números tabulares.

## 15.3. Uso tipográfico

A fonte decorativa não deverá ser utilizada em:

* textos longos;
* pequenos rótulos;
* mensagens de erro;
* botões;
* timer principal.

Ela deverá ser reservada para:

* nome da rotina;
* título do bloco;
* títulos de telas;
* tela de conclusão;
* elementos editoriais.

## 15.4. Tema roxo futurista

O tema de fallback deverá utilizar:

* roxos escuros;
* gradientes;
* pontos de luz;
* blur;
* sobreposições;
* profundidade;
* movimentos discretos, quando permitido.

Ao detectar `prefers-reduced-motion`, efeitos animados deverão ser reduzidos ou removidos.

---

# 16. Critérios de aceite do MVP

## CA-001 — Autenticação

**Dado** que o usuário não está autenticado,
**quando** tenta acessar uma página protegida,
**então** deve ser direcionado para o login.

## CA-002 — Criação de rotina

**Dado** que o usuário possui menos de cinco rotinas,
**quando** preenche uma rotina válida e salva,
**então** a rotina deve aparecer na lista.

## CA-003 — Limite de cinco rotinas

**Dado** que o usuário possui cinco rotinas,
**quando** tenta criar outra,
**então** o sistema deve impedir e explicar o limite.

## CA-004 — Limite de cinquenta blocos

**Dado** que uma rotina possui cinquenta blocos,
**quando** o usuário tenta adicionar mais um,
**então** o sistema deve impedir a inclusão.

## CA-005 — Duração independente

**Dado** que uma rotina possui vários blocos,
**quando** cada bloco recebe uma duração diferente,
**então** o sistema deve preservar cada duração individualmente.

## CA-006 — Ordem livre

**Dado** que o usuário adiciona dois blocos de foco consecutivos,
**quando** salva a rotina,
**então** o sistema não deve exigir um descanso entre eles.

## CA-007 — Reordenação

**Dado** que existem vários blocos,
**quando** o usuário reordena por arrastar e soltar,
**então** a nova ordem deve ser salva.

## CA-008 — Reordenação acessível

**Dado** que existem vários blocos,
**quando** o usuário utiliza os botões de subir e descer,
**então** a ordem deve mudar corretamente.

## CA-009 — Tela de preparação

**Dado** que o usuário seleciona uma rotina,
**quando** abre a execução,
**então** o timer não deve começar imediatamente.

## CA-010 — Contagem de três segundos

**Dado** que o usuário está na preparação,
**quando** clica para iniciar,
**então** a aplicação deve exibir 3, 2, 1 antes do primeiro bloco.

## CA-011 — Pausa

**Dado** que um bloco está em execução,
**quando** o usuário pausa,
**então** o tempo restante deve parar de diminuir.

## CA-012 — Retomada

**Dado** que um bloco está pausado,
**quando** o usuário continua,
**então** o timer deve retomar a partir do tempo restante.

## CA-013 — Concluir e avançar

**Dado** que existe um próximo bloco,
**quando** o usuário clica em “Concluir e avançar”,
**então** o bloco atual deve ser concluído e o seguinte iniciado.

## CA-014 — Avanço automático

**Dado** que uma rotina possui avanço automático habilitado,
**quando** o bloco termina naturalmente,
**então** o próximo bloco deve iniciar automaticamente após a transição.

## CA-015 — Avanço manual

**Dado** que uma rotina possui avanço automático desabilitado,
**quando** o bloco termina,
**então** a sessão deve aguardar o usuário iniciar o próximo.

## CA-016 — F5

**Dado** que um bloco está em execução,
**quando** a página é atualizada,
**então** o timer deve reaparecer com o tempo correto.

## CA-017 — F5 durante pausa

**Dado** que o bloco está pausado,
**quando** a página é atualizada,
**então** o bloco deve continuar pausado.

## CA-018 — Retorno tardio

**Dado** que o horário do bloco passou enquanto o usuário estava ausente,
**quando** ele retorna,
**então** apenas o bloco que estava ativo deve ser concluído.

## CA-019 — Snapshot

**Dado** que uma rotina está sendo executada,
**quando** a rotina original é editada,
**então** a sessão atual não deve mudar.

## CA-020 — Sincronização entre abas

**Dado** que duas abas possuem a mesma sessão,
**quando** o usuário pausa em uma delas,
**então** a outra deve refletir o estado pausado.

## CA-021 — Som habilitado

**Dado** que o som está habilitado,
**quando** um bloco termina naturalmente,
**então** o som deve ser reproduzido quando permitido pelo navegador.

## CA-022 — Som desabilitado

**Dado** que o som está desabilitado,
**quando** um bloco termina,
**então** nenhum som deve ser reproduzido.

## CA-023 — Último bloco

**Dado** que o último bloco termina,
**quando** o término é processado,
**então** a tela de conclusão deve ser exibida.

## CA-024 — Executar novamente

**Dado** que uma rotina foi concluída,
**quando** o usuário escolhe executar novamente,
**então** a aplicação deve mostrar uma nova preparação utilizando a versão mais recente.

## CA-025 — Uma sessão ativa

**Dado** que existe uma sessão ativa,
**quando** o usuário tenta iniciar outra,
**então** o sistema deve solicitar confirmação antes de substituir.

---

# 17. Estratégia de testes

## 17.1. Testes unitários

Deverão cobrir:

* cálculo de duração;
* conversão de horas e minutos;
* cálculo de tempo restante;
* geração de sequência tradicional;
* validação de limite de blocos;
* validação de limite de rotinas;
* transições da máquina de estados;
* comportamento de retorno tardio;
* avanço automático;
* avanço manual;
* snapshot;
* comparação de versões de estado.

## 17.2. Testes de componentes

Deverão cobrir:

* editor de blocos;
* validação de formulário;
* reordenação;
* botões de pausa e retomada;
* estado de espera;
* tela de preparação;
* contagem regressiva;
* tela de conclusão;
* configuração de som;
* modal de substituição de sessão.

## 17.3. Testes end-to-end

Cenários mínimos:

1. Login com sucesso.
2. Criação de rotina.
3. Edição de rotina.
4. Exclusão de rotina.
5. Execução completa.
6. Pausa e retomada.
7. Conclusão manual.
8. Avanço automático.
9. Avanço manual.
10. F5 durante execução.
11. F5 durante pausa.
12. Retorno após término.
13. Edição durante sessão ativa.
14. Sincronização entre duas abas.
15. Substituição de sessão.
16. Modo Tradicional.
17. Limite de cinco rotinas.
18. Limite de cinquenta blocos.
19. Falha de áudio.
20. Falha de background.

## 17.4. Testes temporais

Os testes do timer deverão utilizar relógios controlados ou simulados.

Não deverão depender de esperar vários minutos reais.

Deverão testar:

* passagem normal;
* atraso do event loop;
* suspensão simulada;
* retorno depois do término;
* múltiplos eventos próximos;
* término processado uma única vez.

---

# 18. Métricas técnicas iniciais

Embora o MVP não possua histórico de produtividade, poderão ser acompanhadas métricas técnicas e de produto agregadas, respeitando privacidade.

Exemplos:

* taxa de erro ao salvar rotina;
* taxa de erro ao restaurar sessão;
* falhas de autenticação;
* falhas de áudio;
* falhas de sincronização;
* quantidade de sessões iniciadas;
* quantidade de sessões que chegam à tela de conclusão;
* uso do Modo Rotina;
* uso do Modo Tradicional.

Nenhuma métrica deverá registrar títulos privados das tarefas sem necessidade explícita.

---

# 19. Riscos e mitigação

## 19.1. Precisão do timer

**Risco:** timers do navegador podem ser atrasados.

**Mitigação:** utilizar timestamps e recalcular o tempo restante.

## 19.2. Suspensão de abas

**Risco:** a aba pode ser suspensa.

**Mitigação:** recalcular ao retornar e processar apenas o bloco ativo.

## 19.3. Múltiplas abas

**Risco:** duas abas podem processar o mesmo evento.

**Mitigação:** `BroadcastChannel`, versionamento e transições idempotentes.

## 19.4. Áudio bloqueado

**Risco:** o navegador pode bloquear reprodução.

**Mitigação:** preparar áudio após interação e não depender dele para o fluxo.

## 19.5. Estado local corrompido

**Risco:** dados locais podem ficar inválidos.

**Mitigação:** schema versionado, validação e recuperação segura.

## 19.6. Complexidade do editor

**Risco:** cinquenta blocos podem tornar a tela extensa.

**Mitigação:** cartões compactos, recolhimento de detalhes, reordenação clara e resumo fixo.

## 19.7. Background prejudicar leitura

**Risco:** cores e imagens podem reduzir contraste.

**Mitigação:** overlays e fallback controlado.

## 19.8. Arquivo SQLite na Vercel

**Risco:** filesystem não persistente.

**Mitigação:** utilizar Turso/libSQL remoto.

---

# 20. Roadmap posterior ao MVP

## Fase 2 — Imagens e personalização

* integração com Unsplash;
* busca de imagens;
* seleção de imagem por bloco;
* metadados e atribuição;
* cache;
* fallback;
* backgrounds favoritos.

## Fase 3 — Histórico e produtividade

* histórico de sessões;
* minutos focados;
* blocos concluídos;
* visualizações diárias;
* visualizações semanais;
* desempenho por rotina;
* taxa de conclusão.

## Fase 4 — Sincronização

* continuidade entre dispositivos;
* sessão no servidor;
* prevenção de conflitos remotos;
* atualização em tempo real.

## Fase 5 — Experiência avançada

* PWA;
* notificações push;
* funcionamento offline;
* sons personalizados;
* atalhos de teclado;
* integração com calendário;
* importação e exportação de rotinas;
* compartilhamento de rotinas;
* duplicação;
* templates.

---

# 21. Pontos deliberadamente adiados

Os seguintes pontos deverão ser definidos em documentos técnicos posteriores:

* modelagem detalhada do banco;
* tabelas;
* relações;
* migrations;
* contratos de API;
* estrutura de pastas;
* implementação da máquina de estados;
* formato exato da persistência local;
* estratégia de versionamento do estado;
* tratamento de concorrência entre abas;
* seleção final de Turso ou Neon;
* limites finais de caracteres;
* duração máxima definitiva;
* política de retenção de logs;
* eventos analíticos;
* design system completo;
* protótipos de telas.

Esses itens estão adiados para evitar definir implementação antes de estabilizar os requisitos do produto.

---

# 22. Definição de pronto do MVP

O MVP será considerado funcionalmente pronto quando:

1. O usuário conseguir autenticar-se com Google ou GitHub.
2. O usuário conseguir criar até cinco rotinas.
3. Cada rotina aceitar até cinquenta blocos.
4. Cada bloco aceitar tipo, título, duração e background.
5. A ordem puder ser alterada por arrastar e soltar.
6. A ordem puder ser alterada por botões.
7. Uma rotina puder ser salva, editada e excluída.
8. A edição não alterar uma sessão ativa.
9. O Modo Tradicional gerar blocos corretamente.
10. A tela de preparação mostrar toda a sequência.
11. A contagem regressiva de três segundos funcionar.
12. O timer utilizar cálculo baseado em horário.
13. Pausa e retomada funcionarem.
14. “Concluir e avançar” funcionar.
15. O avanço automático por rotina funcionar.
16. O avanço manual funcionar.
17. F5 não apagar a sessão.
18. O retorno tardio processar apenas um bloco.
19. Duas abas permanecerem sincronizadas.
20. O som puder ser habilitado e desabilitado.
21. O fallback roxo futurista funcionar.
22. O último bloco abrir a tela de conclusão.
23. A rotina puder ser executada novamente.
24. A aplicação funcionar de forma responsiva.
25. Os fluxos críticos possuírem testes automatizados.
26. Erros relevantes serem monitorados.
27. As regras de segurança de acesso serem aplicadas no backend.

---

# 23. Glossário

**Avanço automático:** configuração que determina se o próximo bloco começa sem interação depois que o atual termina naturalmente.

**Bloco:** unidade independente de foco ou descanso.

**BroadcastChannel:** API do navegador utilizada para comunicação entre abas da mesma origem.

**Contagem regressiva:** apresentação de 3, 2 e 1 antes do início do primeiro bloco.

**Foco:** tipo de bloco destinado a atividade concentrada.

**Descanso:** tipo de bloco destinado a pausa ou recuperação.

**Modo Rotina:** execução de uma sequência previamente salva.

**Modo Tradicional:** execução de ciclos gerados a partir de foco, descanso e quantidade.

**Rotina:** sequência salva de blocos independentes.

**Sessão:** execução concreta de uma rotina ou configuração tradicional.

**Snapshot:** cópia imutável da rotina criada no início da sessão.

**Tempo esperado de término:** instante absoluto calculado para determinar quando um bloco termina.

**Transição:** intervalo visual entre a conclusão de um bloco e o início automático do seguinte.

**Estado de espera:** condição na qual o bloco anterior terminou, mas o próximo aguarda início manual.
