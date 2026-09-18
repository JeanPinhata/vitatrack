export const fitRecipes = [
  // ================= CAFÉ DA MANHÃ (10) =================
  {
    id: 'rec-cm-1', name: 'Panqueca Fit de Aveia', category: 'Café da Manhã', prep: 10, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (2 porções):
• 2 ovos inteiros
• 4 colheres de sopa de aveia em flocos finos
• 1 banana madura amassada
• 1 pitada de canela em pó
• 1 colher de chá de fermento em pó
• Óleo de coco para untar

MODO DE PREPARO:
1. Amasse bem a banana com um garfo até virar um purê liso.
2. Adicione os ovos, a aveia, a canela e o fermento e misture até obter uma massa homogênea.
3. Aqueça uma frigideira antiaderente em fogo médio e unte levemente com óleo de coco.
4. Despeje pequenas porções de massa (cerca de 2 colheres de sopa por panqueca).
5. Cozinhe por 2-3 minutos de cada lado, até dourar.
6. Sirva com frutas frescas, mel ou pasta de amendoim.

💡 Dica: Quanto mais madura a banana, mais doce e fácil de amassas!`,
    notes: 'Sem glúten, sem açúcar refinado e riquíssima em fibras.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 100, unit: 'g', protein: 13 }, { food_name: 'Aveia em Flocos', quantity: 40, unit: 'g', protein: 5.6 }]
  },
  {
    id: 'rec-cm-2', name: 'Omelete Recheada de Espinafre', category: 'Café da Manhã', prep: 12, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 3 ovos inteiros
• 50 g de espinafre fresco (ou baby espinafre)
• 30 g de queijo minas frescal em cubinhos
• 1 dente de alho picado
• Sal, pimenta-do-reino e orégano a gosto
• 1 fio de azeite de oliva

MODO DE PREPARO:
1. Bata os ovos com sal, pimenta e orégano até ficarem bem homogêneos.
2. Aqueça o azeite em frigideira antiaderente e refogue o alho por 30 segundos.
3. Adicione o espinafre e mexa até murchar (cerca de 1 minuto).
4. Distribua o espinafre uniformemente na frigideira e despeje os ovos batidos por cima.
5. Cozinhe em fogo baixo com a tampa por 3 minutos.
6. Espalhe o queijo minas sobre metade da omelete e dobre ao meio.
7. Sirva imediatamente.

💡 Dica: Não mexa os ovos após despejar para a omelete ficar firme e bonita!`,
    notes: 'Proteína completa com ferro do espinafre.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 150, unit: 'g', protein: 19.5 }, { food_name: 'Queijo Minas Frescal', quantity: 30, unit: 'g', protein: 4.2 }]
  },
  {
    id: 'rec-cm-3', name: 'Crepioca de Queijo com Ervas', category: 'Café da Manhã', prep: 8, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 1 ovo inteiro
• 2 colheres de sopa de goma de tapioca (polvilho doce)
• 50 g de queijo minas frescal em fatias
• 1 pitada de sal
• Cebolinha e salsinha picadas a gosto

MODO DE PREPARO:
1. Em um pote, misture o ovo com a goma de tapioca e o sal até obter uma massa levemente grumosa.
2. Aqueça uma frigideira antiaderente pequena em fogo médio-baixo sem óleo.
3. Despeje a massa espalhando bem por toda a superfície.
4. Tampe e cozinhe por 2-3 minutos, até a superfície secar.
5. Vire com cuidado e cozinhe mais 1 minuto.
6. Adicione o queijo e as ervas em metade da crepioca e dobre ao meio.
7. Sirva quente.

💡 Dica: A goma de tapioca é a versão mais crocante da tapioca – diferente do polvilho azedo!`,
    notes: 'Sem glúten e alto teor de proteína.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 50, unit: 'g', protein: 6.5 }, { food_name: 'Queijo Minas Frescal', quantity: 50, unit: 'g', protein: 7 }]
  },
  {
    id: 'rec-cm-4', name: 'Mingau Proteico de Aveia', category: 'Café da Manhã', prep: 10, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 40 g de aveia em flocos (4 colheres de sopa)
• 200 ml de leite desnatado ou leite vegetal
• 1 scoop (30 g) de whey protein sabor baunilha
• Canela a gosto
• Frutas para finalizar (banana, morango ou blueberry)

MODO DE PREPARO:
1. Em uma panela pequena, misture a aveia com o leite e leve ao fogo médio.
2. Mexa sem parar por 4-5 minutos até engrossar no ponto de mingau cremoso.
3. Retire do fogo e deixe amornar por 1 minuto (importante para não desnaturar o whey).
4. Adicione o whey protein e mexa vigorosamente até dissolver completamente.
5. Transfira para uma tigela e finalize com canela e frutas frescas.

💡 Dica: Espere o mingau amornar antes de adicionar o whey para preservar a proteína!`,
    notes: 'Café da manhã que sustenta até o almoço.',
    ingredients: [{ food_name: 'Aveia em Flocos', quantity: 40, unit: 'g', protein: 5.6 }, { food_name: 'Whey Protein Concentrado', quantity: 30, unit: 'g', protein: 24 }]
  },
  {
    id: 'rec-cm-5', name: 'Vitamina Proteica de Morango', category: 'Café da Manhã', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 150 ml de leite desnatado ou leite de amêndoas
• 100 g de morangos congelados
• 1 scoop (30 g) de whey protein sabor morango ou neutro
• 1 colher de sopa de aveia em flocos
• 1 colher de chá de mel (opcional)
• Gelo a gosto

MODO DE PREPARO:
1. Coloque todos os ingredientes no liquidificador.
2. Bata por 1-2 minutos até obter uma textura cremosa e homogênea.
3. Prove e ajuste o dulçor com mel se necessário.
4. Sirva imediatamente em copo alto.

💡 Dica: Use os morangos congelados em vez de frescos para a vitamina ficar mais gelada e cremosa sem precisar de gelo!`,
    notes: 'Pronta em 5 minutos, ideal para dias agitados.',
    ingredients: [{ food_name: 'Whey Protein Concentrado', quantity: 30, unit: 'g', protein: 24 }, { food_name: 'Aveia em Flocos', quantity: 15, unit: 'g', protein: 2.1 }]
  },
  {
    id: 'rec-cm-6', name: 'Toast com Ovos Mexidos Cremosos', category: 'Café da Manhã', prep: 10, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 2 fatias de pão integral ou de centeio
• 3 ovos inteiros
• 1 colher de sopa de iogurte grego natural (segredo cremoso)
• Sal, pimenta-do-reino e cebolinha a gosto
• 1 fio de azeite

MODO DE PREPARO:
1. Torre as fatias de pão na torradeira ou frigideira até dourar.
2. Bata os ovos com o iogurte grego, sal e pimenta até espumar levemente.
3. Aqueça uma frigideira antiaderente em fogo baixo com um fio de azeite.
4. Despeje os ovos e mexa lentamente com espátula, fazendo movimentos lentos do centro para as bordas.
5. Desligue antes de secar completamente – os ovos continuarão cozinhando com o calor residual.
6. Disponha sobre o toast e finalize com cebolinha e pimenta.

💡 Dica: O segredo dos ovos mexidos cremosos é o fogo baixo e não mexer rápido demais!`,
    notes: 'Clássico nutritivo com proteína completa.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 150, unit: 'g', protein: 19.5 }]
  },
  {
    id: 'rec-cm-7', name: 'Bowl de Iogurte com Castanhas e Frutas', category: 'Café da Manhã', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 150 g de iogurte grego natural (sem açúcar)
• 2 castanhas-do-pará picadas grosseiramente
• 1 colher de sopa de chia ou linhaça dourada
• 1/2 banana em rodelas
• 5-6 morangos fatiados
• 1 colher de chá de mel ou agave

MODO DE PREPARO:
1. Despeje o iogurte grego em uma tigela funda.
2. Distribua as frutas fatiadas por cima de forma decorativa.
3. Polvilhe a chia ou linhaça uniformemente.
4. Adicione as castanhas picadas para textura crocante.
5. Finalize com um fio de mel.
6. Consuma imediatamente ou deixe na geladeira por até 30 minutos (a chia vai hidratar).

💡 Dica: Monte o bowl na noite anterior sem as frutas frescas para ter um café da manhã instantâneo!`,
    notes: 'Antioxidantes, fibras e proteína em uma tigela.',
    ingredients: [{ food_name: 'Iogurte Grego Natural', quantity: 150, unit: 'g', protein: 15 }, { food_name: 'Castanha-do-Pará', quantity: 15, unit: 'g', protein: 2.7 }]
  },
  {
    id: 'rec-cm-8', name: 'Tapioca Proteica de Queijo', category: 'Café da Manhã', prep: 8, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1586816879360-004f4a799209?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 2 colheres de sopa de goma de tapioca hidratada (ou farinha de tapioca)
• 30 g de queijo minas frescal em fatias finas
• 1 ovo para a massa (versão crepioca)
• Sal a gosto
• Opcionais: tomate cereja, manjericão

MODO DE PREPARO:
1. Se usar crepioca: misture a goma com 1 ovo e sal; se usar tapioca simples, hidrate a goma.
2. Aqueça uma frigideira antiaderente de 20 cm em fogo médio sem untar.
3. Espalhe a massa uniformemente cobrindo toda a superfície da frigideira.
4. Cozinhe por 2 minutos sem mexer, até soltar das bordas.
5. Coloque as fatias de queijo sobre metade da tapioca.
6. Dobre ao meio com auxílio de uma espátula.
7. Sirva com tomate cereja e manjericão se desejar.

💡 Dica: A frigideira tem que estar bem quente antes de colocar a massa para não grudar!`,
    notes: 'Sem glúten – ótima opção para intolerantes.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 50, unit: 'g', protein: 6.5 }, { food_name: 'Queijo Minas Frescal', quantity: 30, unit: 'g', protein: 4.2 }]
  },
  {
    id: 'rec-cm-9', name: 'Smoothie Verde Detox Proteico', category: 'Café da Manhã', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 1 xícara de espinafre fresco (bem lavado)
• 1 maçã verde sem sementes
• 1/2 pepino em pedaços
• 200 ml de água de coco gelada
• 1 scoop (30 g) de whey protein neutro ou baunilha
• Suco de 1/2 limão
• Gelo a gosto

MODO DE PREPARO:
1. Higienize bem o espinafre e o pepino.
2. Corte a maçã em pedaços sem precisar descascar.
3. Coloque todos os ingredientes no liquidificador, começando pelos líquidos.
4. Bata por 1-2 minutos até obter uma textura completamente lisa.
5. Prove e ajuste a acidez com mais limão se necessário.
6. Sirva imediatamente para aproveitar os nutrientes.

💡 Dica: Não adicione açúcar – a maçã e a água de coco já adoçam naturalmente!`,
    notes: 'Riquíssimo em clorofila, magnésio e proteína.',
    ingredients: [{ food_name: 'Whey Protein Concentrado', quantity: 30, unit: 'g', protein: 24 }]
  },
  {
    id: 'rec-cm-10', name: 'Scrambled Tofu com Cúrcuma', category: 'Café da Manhã', prep: 10, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 150 g de tofu firme
• 1/2 colher de chá de cúrcuma (açafrão-da-terra)
• 1 pitada de pimenta-preta (ativa a curcumina)
• Sal, alho em pó e páprica defumada a gosto
• 1 fio de azeite
• Cheiro-verde picado para finalizar

MODO DE PREPARO:
1. Com as mãos limpas, esfarelar o tofu em pedaços irregulares imitando ovos mexidos.
2. Aqueça o azeite em frigideira antiaderente em fogo médio.
3. Adicione o tofu esfarelado e mexa por 2 minutos.
4. Adicione a cúrcuma, pimenta preta, sal, alho em pó e páprica.
5. Mexa bem para distribuir os temperos uniformemente, deixando dourar levemente.
6. Cozinhe por mais 3-4 minutos mexendo ocasionalmente.
7. Finalize com cheiro-verde e sirva com pão integral ou arroz.

💡 Dica: A pimenta preta aumenta a absorção da curcumina em até 2000% – não pule!`,
    notes: 'Opção 100% vegetal rica em proteína e anti-inflamatórios.',
    ingredients: [{ food_name: 'Tofu Firme', quantity: 150, unit: 'g', protein: 22.5 }]
  },

  // ================= ALMOÇO (10) =================
  {
    id: 'rec-alm-1', name: 'Frango Grelhado com Arroz Integral', category: 'Almoço', prep: 25, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 150 g de peito de frango
• 100 g de arroz integral cozido (meia xícara cozido)
• Suco de 1 limão
• 2 dentes de alho esmagados
• Sal, pimenta-do-reino e orégano a gosto
• 1 colher de sopa de azeite de oliva
• Salada verde a gosto para acompanhar

MODO DE PREPARO:
1. Tempere o frango com limão, alho, sal, pimenta e orégano. Deixe marinar por 15 minutos.
2. Aqueça uma grelha ou frigideira de ferro em fogo alto.
3. Grelhe o frango por 6-7 minutos de cada lado, até dourar bem e cozinhar por completo.
4. Deixe descansar 3 minutos antes de fatiar para não perder o suco.
5. Sirva fatiado sobre o arroz integral com a salada ao lado.
6. Regue com um fio de azeite e suco de limão para finalizar.

💡 Dica: Deixe o frango descansar antes de cortar – isso mantém a carne mais suculenta!`,
    notes: 'O clássico fitness que nunca decepciona.',
    ingredients: [{ food_name: 'Peito de Frango Grelhado', quantity: 150, unit: 'g', protein: 46.5 }, { food_name: 'Arroz Branco / Integral', quantity: 100, unit: 'g', protein: 2.6 }]
  },
  {
    id: 'rec-alm-2', name: 'Tilápia Assada no Limão com Legumes', category: 'Almoço', prep: 30, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 200 g de filé de tilápia
• 1/2 abobrinha em rodelas
• 1/2 cenoura em palitos
• 100 g de brócolis em buquês
• Suco de 1 limão
• Alho em pó, sal, pimenta e ervas de provence
• 1 colher de sopa de azeite de oliva

MODO DE PREPARO:
1. Preaqueça o forno a 200°C.
2. Em uma assadeira, disponha os legumes e regue com metade do azeite, sal e pimenta.
3. Tempere o filé de tilápia com limão, alho em pó, sal, pimenta e ervas de provence.
4. Posicione o peixe sobre os legumes na assadeira.
5. Cubra com papel alumínio e leve ao forno por 15 minutos.
6. Retire o papel alumínio e asse mais 10 minutos para dourar.
7. Sirva imediatamente, regado com o caldo formado na assadeira.

💡 Dica: O papel alumínio nos primeiros 15 minutos garante que o peixe fique úmido e não resseque!`,
    notes: 'Peixe magro + vegetais = refeição completa e leve.',
    ingredients: [{ food_name: 'Filé de Tilápia', quantity: 200, unit: 'g', protein: 52 }]
  },
  {
    id: 'rec-alm-3', name: 'Patinho Moído com Feijão e Arroz', category: 'Almoço', prep: 25, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (2 porções):
• 240 g de patinho moído
• 200 g de feijão carioca cozido (1 lata escorrida)
• 200 g de arroz integral cozido
• 1/2 cebola picada
• 3 dentes de alho amassados
• 1 tomate picado
• Sal, cominho, pimenta e cheiro-verde a gosto
• 1 colher de sopa de azeite

MODO DE PREPARO:
1. Em uma frigideira quente com azeite, refogue a cebola até dourar.
2. Adicione o alho e refogue por 30 segundos.
3. Acrescente o patinho moído e mexa bem para separar os grumos.
4. Cozinhe por 8-10 minutos, mexendo até secar e dourar.
5. Tempere com sal, cominho e pimenta.
6. Adicione o tomate picado e cozinhe mais 2 minutos.
7. Sirva com o arroz integral e o feijão aquecido. Finalize com cheiro-verde.

💡 Dica: Não tampe a frigideira ao cozinhar a carne moída – o vapor impede o dourado!`,
    notes: 'Combinação completa de aminoácidos e ferro.',
    ingredients: [{ food_name: 'Patinho Moído Grelhado', quantity: 120, unit: 'g', protein: 38.4 }, { food_name: 'Feijão Carioca Cozido', quantity: 100, unit: 'g', protein: 5 }]
  },
  {
    id: 'rec-alm-4', name: 'Salmão com Crosta de Castanhas', category: 'Almoço', prep: 25, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 150 g de filé de salmão com pele
• 15 g de castanha-do-pará triturada (3-4 castanhas)
• Suco de 1/2 limão siciliano
• Sal, pimenta-do-reino e dill a gosto
• 1 colher de chá de mostarda Dijon
• 1 fio de azeite

MODO DE PREPARO:
1. Preaqueça o forno a 200°C ou use uma frigideira de ferro.
2. Tempere o salmão com sal, pimenta, limão e dill.
3. Espalhe a mostarda Dijon sobre a parte de cima do filé.
4. Pressione as castanhas trituradas sobre a mostarda, formando uma crosta.
5. Em frigideira com azeite quente, sele o lado da pele por 4 minutos em fogo médio-alto.
6. Transfira para o forno e asse por 8-10 minutos, até a crosta dourar.
7. Sirva com salada verde ou legumes grelhados.

💡 Dica: Comece pelo lado da pele – ela vai ficar crocante e proteger a carne enquanto assa!`,
    notes: 'Ômega-3 + proteína magra + gorduras boas das castanhas.',
    ingredients: [{ food_name: 'Salmão Grelhado', quantity: 150, unit: 'g', protein: 37.5 }, { food_name: 'Castanha-do-Pará', quantity: 15, unit: 'g', protein: 2.7 }]
  },
  {
    id: 'rec-alm-5', name: 'Escondidinho Fit de Frango com Abóbora', category: 'Almoço', prep: 40, servings: 3,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (3 porções):
• 300 g de peito de frango cozido e desfiado
• 400 g de abóbora cabotiá cozida
• 1/2 cebola picada
• 3 dentes de alho
• 1 tomate picado sem sementes
• Sal, cominho, pimenta e cheiro-verde
• 50 g de queijo cottage light para gratinar (opcional)

MODO DE PREPARO:
1. Cozinhe e desfie o frango. Reserve.
2. Refogue a cebola e o alho, adicione o tomate e o frango. Tempere e reserve.
3. Cozinhe a abóbora no vapor ou na água até amolecer. Escorra bem e amasse com garfo.
4. Tempere o purê com sal e pimenta. Não adicione manteiga!
5. Em um refratário, coloque o frango refogado na base.
6. Cubra com o purê de abóbora e alise com espátula.
7. Se desejar, espalhe o cottage e leve ao forno a 200°C por 15 minutos para gratinar.

💡 Dica: Escorra muito bem a abóbora antes de amassar para o purê não ficar aguado!`,
    notes: 'Low carb, rico em betacaroteno e altamente saciante.',
    ingredients: [{ food_name: 'Peito de Frango Grelhado', quantity: 200, unit: 'g', protein: 62 }]
  },
  {
    id: 'rec-alm-6', name: 'Espaguete de Abobrinha ao Molho de Carne', category: 'Almoço', prep: 20, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 1 abobrinha grande (cerca de 250 g)
• 150 g de patinho moído
• 1/2 cebola pequena picada
• 2 dentes de alho amassados
• 1 tomate maduro picado ou 3 colheres de molho de tomate
• Sal, pimenta, orégano e manjericão fresco
• 1 fio de azeite

MODO DE PREPARO:
1. Com um espiralizador ou descascador, faça os "espaguetes" de abobrinha. Reserve.
2. Em frigideira com azeite quente, refogue a cebola e o alho.
3. Adicione a carne moída e cozinhe por 8 minutos até dourar bem.
4. Acrescente o tomate picado, sal, pimenta e orégano. Cozinhe mais 5 minutos.
5. Em outra frigideira quente (sem óleo), refogue o espaguete de abobrinha por apenas 2 minutos – não mais que isso para não soltar água.
6. Sirva a abobrinha com o molho de carne por cima e manjericão fresco.

💡 Dica: Não cozinhe a abobrinha demais para não virar uma "sopa" – 2 minutos é suficiente!`,
    notes: 'Zero carboidrato refinado. Satisfaz vontade de macarrão.',
    ingredients: [{ food_name: 'Patinho Moído Grelhado', quantity: 150, unit: 'g', protein: 48 }]
  },
  {
    id: 'rec-alm-7', name: 'Strogonoff Fit de Frango', category: 'Almoço', prep: 25, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (2 porções):
• 300 g de peito de frango em tiras
• 200 g de cogumelo paris fatiado
• 50 g de creme de ricota light (em vez de creme de leite)
• 1/2 cebola picada
• 2 dentes de alho amassados
• 1 colher de sobremesa de mostarda Dijon
• Sal, pimenta, paprica e cheiro-verde
• 1 fio de azeite

MODO DE PREPARO:
1. Tempere o frango com sal e pimenta. Sele em frigideira quente com azeite por 3 minutos de cada lado.
2. Retire o frango e, na mesma frigideira, refogue a cebola e o alho.
3. Adicione os cogumelos e refogue por 3 minutos até soltar a água e secar.
4. Retorne o frango, adicione a mostarda e misture bem.
5. Abaixe o fogo, adicione o creme de ricota e mexa até incorporar.
6. Ajuste o sal e a páprica. Cozinhe por 2-3 minutos em fogo baixo.
7. Finalize com cheiro-verde e sirva com arroz integral.

💡 Dica: O creme de ricota substitui o creme de leite com muito menos gordura e mais proteína!`,
    notes: 'Versão fit do clássico que todo mundo ama.',
    ingredients: [{ food_name: 'Peito de Frango Grelhado', quantity: 200, unit: 'g', protein: 62 }, { food_name: 'Creme de Ricota Light', quantity: 50, unit: 'g', protein: 4.5 }]
  },
  {
    id: 'rec-alm-8', name: 'Bowl de Atum com Grão de Bico', category: 'Almoço', prep: 10, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 120 g de atum ao natural (1 lata escorrida)
• 100 g de grão de bico cozido (ou 1/2 lata escorrida)
• 1/2 pepino em cubinhos
• 1 tomate maduro picado
• 1/4 de cebola roxa fatiada
• Suco de 1 limão
• 1 colher de sopa de azeite de oliva extravirgem
• Sal, pimenta, salsinha e hortelã picados

MODO DE PREPARO:
1. Escorra bem o atum e o grão de bico. Reserve.
2. Em uma tigela grande, misture o pepino, tomate e cebola roxa.
3. Adicione o grão de bico e o atum, misturando delicadamente para não desmanchar.
4. Tempere com limão, azeite, sal e pimenta. Misture.
5. Finalize com salsinha e hortelã picados.
6. Sirva imediatamente ou deixe gelar por 15 minutos para intensificar o sabor.

💡 Dica: Adicione azeite de oliva extra virgem – ele potencializa a absorção dos nutrientes do atum!`,
    notes: 'Almoço proteico e mediterrâneo em 10 minutos.',
    ingredients: [{ food_name: 'Atum Sólido ao Natural', quantity: 120, unit: 'g', protein: 31.2 }, { food_name: 'Grão de Bico Cozido', quantity: 100, unit: 'g', protein: 8.5 }]
  },
  {
    id: 'rec-alm-9', name: 'Tofu Grelhado com Lentilha Temperada', category: 'Almoço', prep: 25, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 150 g de tofu firme em fatias grossas
• 100 g de lentilha vermelha cozida
• 1/2 cebola em meia-lua
• 2 dentes de alho
• 1 tomate picado
• Cominho, cúrcuma, sal e pimenta
• Suco de 1/2 limão e salsinha

MODO DE PREPARO:
1. Cozinhe a lentilha em água com sal por 15-20 minutos. Escorra e reserve.
2. Seque bem as fatias de tofu com papel toalha (essencial para grelhar).
3. Em frigideira antiaderente bem quente com fio de azeite, grelhe o tofu por 4 minutos de cada lado até criar crosta dourada. Tempere com sal e pimenta.
4. Na mesma frigideira, refogue a cebola e o alho. Adicione o tomate.
5. Adicione a lentilha cozida, cominho e cúrcuma. Refogue por 3 minutos.
6. Sirva a lentilha com o tofu grelhado por cima e finalize com limão e salsinha.

💡 Dica: Secar o tofu antes de grelhar é o segredo para conseguir uma crosta crocante!`,
    notes: 'Prato 100% vegetal com proteína completa.',
    ingredients: [{ food_name: 'Tofu Firme', quantity: 150, unit: 'g', protein: 22.5 }, { food_name: 'Lentilha Cozida', quantity: 100, unit: 'g', protein: 9 }]
  },
  {
    id: 'rec-alm-10', name: 'Salada Completa de Frango Grelhado', category: 'Almoço', prep: 15, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 150 g de peito de frango grelhado e fatiado
• 2 xícaras de folhas mistas (alface, rúcula, espinafre)
• 1/2 pepino em rodelas
• 1 tomate cereja cortado ao meio
• 1/4 de abacate em cubos
• Suco de 1 limão e 1 colher de sopa de azeite
• Sal, pimenta e orégano
• Sementes de girassol ou abóbora (opcional)

MODO DE PREPARO:
1. Grelhe o frango temperado e fatie em tiras diagonais para melhor apresentação.
2. Lave e seque bem as folhas. Disponha em uma saladeira grande.
3. Adicione o pepino, tomate cereja e abacate.
4. Posicione as tiras de frango grelhado por cima.
5. Prepare o molho: misture limão, azeite, sal, pimenta e orégano.
6. Regue com o molho na hora de servir para não murchar as folhas.
7. Finalize com as sementes crocantes.

💡 Dica: Adicione o molho apenas na hora de comer para a salada durar mais na geladeira!`,
    notes: 'Leve, colorida e com todos os macronutrientes.',
    ingredients: [{ food_name: 'Peito de Frango Grelhado', quantity: 150, unit: 'g', protein: 46.5 }]
  },

  // ================= LANCHE DA TARDE (10) =================
  {
    id: 'rec-lt-1', name: 'Bowl de Iogurte Grego com Aveia', category: 'Lanche da Tarde', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 150 g de iogurte grego natural integral (sem açúcar)
• 2 colheres de sopa de aveia em flocos
• 1 colher de chá de mel puro
• 1/2 banana fatiada ou frutas vermelhas
• Canela a gosto

MODO DE PREPARO:
1. Despeje o iogurte grego em uma tigela ou pote de vidro.
2. Adicione a aveia em flocos e misture levemente (deixando alguns grumos para textura).
3. Distribua as frutas fatiadas por cima.
4. Finalize com um fio de mel e polvilhe canela.
5. Consuma imediatamente ou refrigere por até 2 horas.

💡 Dica: Para ter mais textura, use a aveia em flocos grossos e não a fina – ela fica crocante no iogurte!`,
    notes: 'Probióticos + fibras + proteína no lanche perfeito.',
    ingredients: [{ food_name: 'Iogurte Grego Natural', quantity: 150, unit: 'g', protein: 15 }, { food_name: 'Aveia em Flocos', quantity: 20, unit: 'g', protein: 2.8 }]
  },
  {
    id: 'rec-lt-2', name: 'Bolinha de Batata Doce com Cottage', category: 'Lanche da Tarde', prep: 20, servings: 3,
    image_url: 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (3 porções):
• 300 g de batata doce cozida e amassada
• 50 g de queijo cottage light
• 1 ovo
• Sal, pimenta e cebolinha picada a gosto
• Azeite ou spray de cozinha para assar

MODO DE PREPARO:
1. Cozinhe a batata doce até ficar bem macia. Escorra e amasse enquanto ainda quente.
2. Deixe esfriar por 10 minutos.
3. Misture com o ovo, sal, pimenta e cebolinha picada.
4. Modele bolinhas do tamanho de uma bola de golfe.
5. Faça um buraco no centro de cada bolinha e recheie com 1 colher de chá de cottage.
6. Feche o recheio e posicione em assadeira untada.
7. Asse a 180°C por 20 minutos até dourar.

💡 Dica: Não substitua a batata doce por outro tipo de batata – ela tem um índice glicêmico mais baixo!`,
    notes: 'Lanche salgado e proteico para segurar a fome.',
    ingredients: [{ food_name: 'Queijo Cottage Light', quantity: 50, unit: 'g', protein: 6 }]
  },
  {
    id: 'rec-lt-3', name: 'Shake de Whey com Banana e Canela', category: 'Lanche da Tarde', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 1 scoop (30 g) de whey protein (qualquer sabor)
• 1 banana madura congelada
• 200 ml de leite desnatado ou leite de amêndoas
• 1/2 colher de chá de canela em pó
• 1 colher de sopa de pasta de amendoim (opcional)
• Gelo a gosto

MODO DE PREPARO:
1. Coloque o leite no liquidificador primeiro (facilita a mistura).
2. Adicione a banana congelada, o whey, a canela e o amendoim.
3. Bata por 1 minuto até ficar completamente homogêneo.
4. Adicione gelo e bata rapidamente por mais 15 segundos.
5. Sirva imediatamente em copo grande.

💡 Dica: Congele a banana com antecedência – ela dá uma textura cremosa de milk-shake!`,
    notes: 'Perfeito como pré-treino 30 minutos antes de se exercitar.',
    ingredients: [{ food_name: 'Whey Protein Concentrado', quantity: 30, unit: 'g', protein: 24 }]
  },
  {
    id: 'rec-lt-4', name: 'Mix de Castanhas com Queijo Minas', category: 'Lanche da Tarde', prep: 2, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 2 castanhas-do-pará
• 10 g de amêndoas naturais (sem sal)
• 10 g de nozes
• 50 g de queijo minas frescal em cubinhos
• 1 colher de chá de uva-passa (opcional)

MODO DE PREPARO:
1. Separe as castanhas, amêndoas e nozes em um recipiente pequeno.
2. Corte o queijo minas em cubinhos de 1 cm.
3. Monte o mix colocando as castanhas junto ao queijo.
4. Adicione uva-passa se desejar um toque doce.
5. Pode ser preparado com antecedência e armazenado em pote fechado na geladeira por até 2 dias.

💡 Dica: Não consuma mais de 2 castanhas-do-pará por dia – elas são ricas em selênio e o excesso pode ser tóxico!`,
    notes: 'Gorduras boas + proteína = saciedade prolongada.',
    ingredients: [{ food_name: 'Castanha-do-Pará', quantity: 20, unit: 'g', protein: 3.6 }, { food_name: 'Queijo Minas Frescal', quantity: 30, unit: 'g', protein: 4.2 }]
  },
  {
    id: 'rec-lt-5', name: 'Wrap de Frango com Ricota', category: 'Lanche da Tarde', prep: 8, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 1 folha de alface americana grande (ou 1 folha de couve)
• 60 g de peito de frango grelhado e desfiado
• 20 g de creme de ricota light
• 1/4 de tomate em fatias finas
• 1/4 de abacate amassado com limão
• Sal, pimenta e orégano a gosto

MODO DE PREPARO:
1. Separe a folha de alface (funciona como a "tortilha" do wrap).
2. Espalhe o creme de ricota no centro da folha como uma base.
3. Adicione o abacate amassado por cima.
4. Distribua o frango desfiado temperado.
5. Adicione as fatias de tomate.
6. Tempere com sal, pimenta e orégano.
7. Enrole a folha firmemente e sirva.

💡 Dica: Use folha de alface americana ou romana – são mais firmes e não rasgam ao enrolar!`,
    notes: 'Wrap low carb perfeito para levar na bolsa.',
    ingredients: [{ food_name: 'Peito de Frango Grelhado', quantity: 60, unit: 'g', protein: 18.6 }, { food_name: 'Creme de Ricota Light', quantity: 20, unit: 'g', protein: 1.8 }]
  },
  {
    id: 'rec-lt-6', name: 'Bolinho de Caneca de Cacau Fit', category: 'Lanche da Tarde', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1519438822975-23b2b3ffe4bb?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 1 ovo inteiro
• 1 colher de sopa de aveia em flocos finos
• 1 scoop (15 g) de whey protein sabor chocolate
• 1 colher de chá de cacau 100% em pó
• 1 pitada de fermento em pó
• 1 colher de chá de adoçante culinário
• 1 colher de sopa de água ou leite

MODO DE PREPARO:
1. Em uma caneca grande (capacidade 300 ml), misture todos os ingredientes secos.
2. Adicione o ovo e a água ou leite.
3. Misture bem com um garfo até não ter grumos.
4. Leve ao micro-ondas por 1 minuto e 30 segundos em potência máxima.
5. Verifique a consistência. Se ainda líquido no centro, mais 30 segundos.
6. Deixe esfriar 1 minuto antes de comer direto na caneca.

💡 Dica: Não cozinhe demais – o bolinho continua assando depois de sair do micro-ondas!`,
    notes: 'Satisfação de doce com proteína em 5 minutos.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 50, unit: 'g', protein: 6.5 }, { food_name: 'Whey Protein Concentrado', quantity: 15, unit: 'g', protein: 12 }]
  },
  {
    id: 'rec-lt-7', name: 'Patê de Atum Cremoso com Torradas', category: 'Lanche da Tarde', prep: 5, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (2 porções):
• 120 g de atum ao natural escorrido (1 lata)
• 30 g de creme de ricota light
• Suco de 1/2 limão
• 1 colher de chá de mostarda amarela
• Sal, pimenta e salsinha picada
• Torradas integrais para acompanhar

MODO DE PREPARO:
1. Escorra bem o atum da lata e coloque em uma tigela.
2. Amasse o atum com um garfo até ficar bem desfiado.
3. Adicione o creme de ricota e misture bem.
4. Tempere com limão, mostarda, sal e pimenta.
5. Incorpore a salsinha picada.
6. Ajuste o sal e a acidez conforme preferência.
7. Sirva nas torradas integrais. Conserve em pote fechado por até 2 dias na geladeira.

💡 Dica: Use atum ao natural (em água) – o atum em óleo tem mais calorias e gordura desnecessária!`,
    notes: 'Snack proteico que dura na geladeira para a semana toda.',
    ingredients: [{ food_name: 'Atum Sólido ao Natural', quantity: 60, unit: 'g', protein: 15.6 }, { food_name: 'Creme de Ricota Light', quantity: 30, unit: 'g', protein: 2.7 }]
  },
  {
    id: 'rec-lt-8', name: 'Ovos Cozidos com Tempero Especial', category: 'Lanche da Tarde', prep: 12, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 2 ovos inteiros
• 1 colher de sopa de azeite de oliva
• Sal marinho grosso e pimenta-do-reino
• Páprica defumada a gosto
• Ervas finas ou cebolinha

MODO DE PREPARO:
1. Coloque os ovos em uma panela com água fria (a água deve cobrir completamente).
2. Leve ao fogo alto até ferver.
3. Após ferver, cozinhe por exatamente 9 minutos para gema cremosa ou 12 minutos para gema dura.
4. Transfira imediatamente para uma tigela com água gelada e gelo por 5 minutos.
5. Descasque com cuidado sob água corrente.
6. Corte ao meio e tempere com azeite, sal marinho, páprica e ervas.
7. Consuma logo após o preparo ou refrigere por até 3 dias na casca.

💡 Dica: A água gelada após o cozimento interrompe o cozimento e facilita descascar!`,
    notes: 'Proteína mais biodisponível e prático para qualquer hora.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 100, unit: 'g', protein: 13 }]
  },
  {
    id: 'rec-lt-9', name: 'Torrada Integral com Cottage e Tomate', category: 'Lanche da Tarde', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 2 fatias de pão integral tostado
• 50 g de queijo cottage light
• 3 tomates cereja cortados ao meio
• 5 folhas de manjericão fresco
• Sal, pimenta e fio de azeite

MODO DE PREPARO:
1. Torre as fatias de pão integral até ficarem douradas e crocantes.
2. Espalhe generosamente o cottage sobre cada fatia como base.
3. Distribua os tomates cereja cortados por cima.
4. Rasgue as folhas de manjericão e espalhe sobre os tomates.
5. Tempere com sal, pimenta e um fio de azeite de oliva extravirgem.
6. Sirva imediatamente para o pão não perder a crocância.

💡 Dica: O manjericão fresco faz TODA a diferença – não substitua pelo seco nesta receita!`,
    notes: 'Versão saudável de bruschetta italiana.',
    ingredients: [{ food_name: 'Queijo Cottage Light', quantity: 50, unit: 'g', protein: 6 }]
  },
  {
    id: 'rec-lt-10', name: 'Smoothie Proteico de Morango e Baunilha', category: 'Lanche da Tarde', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 150 g de morangos congelados
• 1 scoop (30 g) de whey protein sabor baunilha
• 150 ml de leite desnatado
• 1 colher de sopa de aveia em flocos
• 1/2 colher de chá de extrato de baunilha puro
• Gelo a gosto

MODO DE PREPARO:
1. Coloque o leite e o extrato de baunilha no liquidificador.
2. Adicione os morangos congelados, o whey e a aveia.
3. Bata por 1 minuto e meio até obter textura cremosa.
4. Adicione gelo e bata rapidamente por mais 20 segundos.
5. Despeje em copo alto e sirva com canudinho.

💡 Dica: Os morangos congelados eliminam a necessidade de gelo e deixam o smoothie mais espesso!`,
    notes: 'Parece milk-shake mas é seu lanche proteico.',
    ingredients: [{ food_name: 'Whey Protein Concentrado', quantity: 30, unit: 'g', protein: 24 }]
  },

  // ================= JANTAR (10) =================
  {
    id: 'rec-jan-1', name: 'Sopa Cremosa de Frango com Legumes', category: 'Jantar', prep: 35, servings: 3,
    image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (3 porções):
• 300 g de peito de frango
• 1 cenoura grande em cubos
• 1 abobrinha em cubos
• 1 batata doce pequena em cubos
• 1/2 cebola picada
• 3 dentes de alho
• 1 litro de caldo de frango caseiro (ou água com temperos)
• Sal, pimenta, louro e cheiro-verde

MODO DE PREPARO:
1. Cozinhe o frango em água temperada com sal e louro por 20 minutos.
2. Retire o frango, desfie e reserve o caldo do cozimento.
3. Em panela com fio de azeite, refogue a cebola e o alho.
4. Adicione os legumes cortados e refogue por 3 minutos.
5. Despeje o caldo do cozimento e cozinhe em fogo médio por 15 minutos.
6. Com um mixer, bata parte dos legumes para engrossar (deixe alguns pedaços inteiros).
7. Adicione o frango desfiado, ajuste o sal e finalize com cheiro-verde.

💡 Dica: Congelar porções individuais é ótimo para ter sempre um jantar saudável disponível!`,
    notes: 'Reconfortante, nutritivo e perfeito para os dias frios.',
    ingredients: [{ food_name: 'Peito de Frango Grelhado', quantity: 150, unit: 'g', protein: 46.5 }]
  },
  {
    id: 'rec-jan-2', name: 'Omelete de Forno Recheada', category: 'Jantar', prep: 30, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (2 porções):
• 4 ovos inteiros
• 50 g de queijo minas frescal ralado
• 1/2 pimentão vermelho em tiras
• 1/2 cebola em fatias finas
• 1 xícara de espinafre
• Sal, pimenta e noz-moscada
• Azeite para untar o refratário

MODO DE PREPARO:
1. Preaqueça o forno a 180°C e unte um refratário pequeno com azeite.
2. Em frigideira, refogue a cebola e o pimentão com sal por 3 minutos.
3. Adicione o espinafre e mexa até murchar. Reserve.
4. Bata os ovos com sal, pimenta e noz-moscada até espumar.
5. Despeje metade dos ovos no refratário.
6. Adicione os legumes refogados uniformemente.
7. Despeje o restante dos ovos por cima e finalize com o queijo ralado.
8. Asse por 20-25 minutos até firmar e dourar levemente.

💡 Dica: Espete um palito no centro – se sair seco, a omelete está pronta!`,
    notes: 'Jantar prático que pode ser preparado com antecedência.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 200, unit: 'g', protein: 26 }, { food_name: 'Queijo Minas Frescal', quantity: 50, unit: 'g', protein: 7 }]
  },
  {
    id: 'rec-jan-3', name: 'Salmão Grelhado com Salada Verde', category: 'Jantar', prep: 15, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 120 g de filé de salmão
• 2 xícaras de folhas mistas (alface, rúcula, agrião)
• 1/2 pepino fatiado
• 1 tomate cortado em quatro
• Suco de 1 limão siciliano
• Sal, pimenta-do-reino e dill fresco
• 1 fio de azeite

MODO DE PREPARO:
1. Tempere o salmão com sal, pimenta, dill e metade do limão. Deixe marinar 10 minutos.
2. Aqueça frigideira antiaderente em fogo médio-alto com fio de azeite.
3. Sele o salmão pelo lado da pele por 4 minutos até dourar.
4. Vire e cozinhe mais 3 minutos – o centro pode ficar levemente rosado (ponto ideal).
5. Monte a salada com as folhas, pepino e tomate.
6. Quebre o salmão em lascas sobre a salada ou sirva inteiro ao lado.
7. Regue com azeite, limão restante, sal e pimenta.

💡 Dica: O salmão não precisa ser cozido completamente – o centro rosado é mais saboroso e nutritivo!`,
    notes: 'Jantar leve e repleto de Ômega-3.',
    ingredients: [{ food_name: 'Salmão Grelhado', quantity: 120, unit: 'g', protein: 30 }]
  },
  {
    id: 'rec-jan-4', name: 'Hambúrguer Artesanal de Patinho', category: 'Jantar', prep: 20, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (2 porções):
• 300 g de patinho moído (peça o açougueiro moer na hora)
• 1 dente de alho ralado
• Sal, pimenta-do-reino e alecrim seco
• Folhas de alface e rodelas de tomate
• 2 fatias de queijo minas frescal
• Mostarda e azeite a gosto

MODO DE PREPARO:
1. Misture a carne com alho, sal, pimenta e alecrim. Não misture demais.
2. Divida em 2 porções e modele os discos pressionando o centro (evita encolher).
3. Leve à grelha ou frigideira de ferro em fogo alto sem adicionar gordura.
4. Grelhe por 4 minutos de cada lado sem pressionar (perde o suco).
5. Coloque o queijo no último minuto e tampe para derreter.
6. Monte: alface, hambúrguer com queijo, tomate e mostarda.
7. Sirva sem pão ou com pão integral.

💡 Dica: Peça patinho moído fresquinho – evite carne moída embalada que pode ter mais gordura!`,
    notes: 'Jantar satisfatório e proteico sem precisar de pão.',
    ingredients: [{ food_name: 'Patinho Moído Grelhado', quantity: 150, unit: 'g', protein: 48 }]
  },
  {
    id: 'rec-jan-5', name: 'Pizza Fit com Massa de Frango', category: 'Jantar', prep: 35, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (2 porções):
• 200 g de peito de frango cru processado (massa)
• 1 ovo
• Sal, orégano e alho em pó para a massa
• 3 colheres de sopa de molho de tomate sem açúcar
• 50 g de queijo minas frescal em fatias finas
• Tomate cereja, rúcula e azeite para cobrir

MODO DE PREPARO:
1. Processe o frango cru no processador até virar uma pasta.
2. Misture com o ovo, sal, orégano e alho em pó até homogeneizar.
3. Forre uma assadeira com papel manteiga e espalhe a "massa" em formato redondo fino.
4. Asse a 200°C por 15-18 minutos até firmar e dourar levemente.
5. Retire do forno, espalhe o molho de tomate e distribua o queijo.
6. Retorne ao forno por 5 minutos apenas para derreter o queijo.
7. Finalize com tomate cereja e rúcula fresca após assar.

💡 Dica: Quanto mais fina a massa de frango, mais crocante fica – ouse espremer bem!`,
    notes: 'Zero glúten e carbo. Toda a satisfação de pizza com proteína.',
    ingredients: [{ food_name: 'Peito de Frango Grelhado', quantity: 200, unit: 'g', protein: 62 }, { food_name: 'Queijo Minas Frescal', quantity: 50, unit: 'g', protein: 7 }]
  },
  {
    id: 'rec-jan-6', name: 'Espetinho de Tilápia Grelhada', category: 'Jantar', prep: 20, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (2 porções):
• 300 g de filé de tilápia em cubos de 3 cm
• 1 pimentão vermelho em quadrados
• 1 pimentão amarelo em quadrados
• Tomates cereja inteiros
• Suco de 1 limão, sal e pimenta
• 1 colher de chá de páprica defumada e cominho
• Palitos de espeto umedecidos em água

MODO DE PREPARO:
1. Umedeça os palitos de madeira por 15 minutos (evita queimar na grelha).
2. Tempere os cubos de tilápia com limão, sal, pimenta, páprica e cominho.
3. Monte os espetinhos alternando: tilápia, pimentão vermelho, tomate, pimentão amarelo.
4. Aqueça uma grelha ou frigideira grill em fogo alto.
5. Grelhe os espetinhos por 3-4 minutos de cada lado.
6. Sirva com molho de iogurte (iogurte + limão + dill) e salada.

💡 Dica: O peixe está pronto quando a carne ficar opaca e soltar facilmente do espeto!`,
    notes: 'Peixe magro com vegetais coloridos e antioxidantes.',
    ingredients: [{ food_name: 'Filé de Tilápia', quantity: 150, unit: 'g', protein: 39 }]
  },
  {
    id: 'rec-jan-7', name: 'Tofu Crocante Empanado na Aveia', category: 'Jantar', prep: 25, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 150 g de tofu extra firme
• 30 g de aveia em flocos finos
• 1 ovo (ou 2 colheres de sopa de água com farinha para versão vegana)
• Alho em pó, páprica, sal e pimenta a gosto
• Spray de azeite para assar

MODO DE PREPARO:
1. Pressione o tofu com papel toalha por 10 minutos para remover o excesso de água.
2. Corte em palitos ou cubos.
3. Em um prato, bata o ovo. Em outro, misture a aveia com alho em pó, páprica, sal e pimenta.
4. Passe cada pedaço de tofu no ovo e depois na aveia temperada, pressionando para aderir.
5. Disponha em assadeira forrada com papel manteiga e aplique spray de azeite.
6. Asse a 200°C por 20-25 minutos, virando na metade, até dourar e ficar crocante.
7. Sirva com molho de iogurte ou homus.

💡 Dica: A chave da crocância é remover TODA a água do tofu com pressão e papel toalha!`,
    notes: 'Jantar vegano satisfatório e surpreendentemente crocante.',
    ingredients: [{ food_name: 'Tofu Firme', quantity: 150, unit: 'g', protein: 22.5 }, { food_name: 'Aveia em Flocos', quantity: 20, unit: 'g', protein: 2.8 }]
  },
  {
    id: 'rec-jan-8', name: 'Salada de Atum Mediterrânea', category: 'Jantar', prep: 10, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 120 g de atum ao natural escorrido
• 80 g de grão de bico cozido
• 1/2 pepino em cubinhos
• 5 azeitonas pretas
• 1/4 de cebola roxa em fatias finas
• 1 colher de sopa de alcaparras (opcional)
• Suco de 1 limão, azeite, sal e pimenta
• Salsinha e hortelã fresca

MODO DE PREPARO:
1. Em uma tigela, misture o atum escorrido com o grão de bico.
2. Adicione pepino, cebola roxa e azeitonas cortadas ao meio.
3. Adicione alcaparras se tiver disponível.
4. Prepare o molho: limão, azeite, sal e pimenta. Misture bem.
5. Regue a salada com o molho e misture delicadamente.
6. Finalize com salsinha e hortelã picadas generosamente.
7. Sirva imediatamente ou deixe repousar 10 min para intensificar.

💡 Dica: Escolha atum em água – tem menos calorias e permite sentir melhor o sabor dos temperos!`,
    notes: 'Jantar mediterrâneo leve e riquíssimo em proteína.',
    ingredients: [{ food_name: 'Atum Sólido ao Natural', quantity: 120, unit: 'g', protein: 31.2 }, { food_name: 'Grão de Bico Cozido', quantity: 80, unit: 'g', protein: 6.8 }]
  },
  {
    id: 'rec-jan-9', name: 'Charuto de Couve com Carne Moída', category: 'Jantar', prep: 30, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (2 porções):
• 8 folhas grandes de couve
• 200 g de patinho moído
• 1/2 cebola picada e 3 dentes de alho
• 1 tomate picado sem sementes
• Sal, cominho, pimenta, salsinha
• 1 xícara de molho de tomate sem açúcar

MODO DE PREPARO:
1. Branqueie as folhas de couve: mergulhe em água fervente por 30 segundos e retire para água gelada.
2. Refogue a cebola e alho, adicione a carne moída e cozinhe por 8 minutos.
3. Adicione o tomate, sal, cominho, pimenta e salsinha. Mexa por 2 minutos. Deixe esfriar.
4. Coloque 1-2 colheres do recheio sobre cada folha de couve.
5. Dobre as laterais e enrole firmemente como um rolinho.
6. Arrume os charutos em panela baixa, cubra com molho de tomate.
7. Cozinhe em fogo baixo com tampa por 15 minutos.

💡 Dica: Retire o talo central duro da couve para facilitar enrolar sem quebrar a folha!`,
    notes: 'Low carb e repleto de ferro e fibras da couve.',
    ingredients: [{ food_name: 'Patinho Moído Grelhado', quantity: 200, unit: 'g', protein: 64 }]
  },
  {
    id: 'rec-jan-10', name: 'Berinjela Recheada Assada', category: 'Jantar', prep: 40, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (2 porções):
• 2 berinjelas médias
• 150 g de peito de frango cozido e desfiado
• 1 tomate picado
• 1/2 cebola picada e 3 dentes de alho
• Sal, pimenta, orégano e páprica
• 2 colheres de sopa de molho de tomate
• Queijo minas ralado para gratinar (opcional)

MODO DE PREPARO:
1. Corte as berinjelas ao meio no sentido do comprimento.
2. Com uma colher, retire o miolo deixando uma borda de 1 cm. Pique o miolo e reserve.
3. Pincele as cascas com azeite e asse a 180°C por 15 minutos para amolecer.
4. Refogue a cebola, alho e o miolo da berinjela picado.
5. Adicione o frango desfiado, tomate, molho de tomate e temperos. Cozinhe 5 minutos.
6. Recheie as metades de berinjela com a mistura.
7. Se desejar, polvilhe queijo ralado e asse mais 10 minutos para gratinar.

💡 Dica: A berinjela pré-assada antes de rechear garante que ela não fique crua ou dura!`,
    notes: 'Fibras + proteína em uma apresentação linda.',
    ingredients: [{ food_name: 'Peito de Frango Grelhado', quantity: 150, unit: 'g', protein: 46.5 }]
  },

  // ================= SOBREMESA (10) =================
  {
    id: 'rec-sob-1', name: 'Mousse Proteico de Chocolate', category: 'Sobremesa', prep: 10, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (2 porções):
• 200 g de iogurte grego natural (sem açúcar)
• 2 scoops (40 g) de whey protein sabor chocolate
• 1 colher de sopa de cacau 100% em pó
• 1 colher de chá de adoçante culinário (opcional)
• 1 colher de sopa de água gelada

MODO DE PREPARO:
1. Em uma tigela funda, coloque o iogurte grego.
2. Adicione o whey chocolate e o cacau em pó.
3. Misture vigorosamente com um garfo até não ter grumos.
4. Adicione a água aos poucos para ajustar a consistência.
5. Prove e adoce com adoçante se necessário.
6. Distribua em taças individuais.
7. Leve à geladeira por pelo menos 30 minutos para firmar e servir gelado.

💡 Dica: Quanto mais tempo na geladeira, mais cremoso e firme fica – ideal fazer na véspera!`,
    notes: 'Toda a satisfação do chocolate com proteína e zero culpa.',
    ingredients: [{ food_name: 'Iogurte Grego Natural', quantity: 100, unit: 'g', protein: 10 }, { food_name: 'Whey Protein Concentrado', quantity: 20, unit: 'g', protein: 16 }]
  },
  {
    id: 'rec-sob-2', name: 'Crepe Proteico de Morango', category: 'Sobremesa', prep: 15, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (2 porções):
• 2 ovos inteiros
• 2 colheres de sopa de aveia em flocos finos
• 1 scoop (15 g) de whey protein baunilha
• 1 colher de sopa de adoçante
• Pitada de sal
• RECHEIO: 100 g de morangos fatiados + 50 g de ricota amassada com adoçante

MODO DE PREPARO:
1. Bata os ovos, aveia, whey, adoçante e sal até virar uma massa lisa.
2. Aqueça uma frigideira antiaderente de 20 cm em fogo baixo com mínimo de azeite.
3. Despeje 1/4 da massa e incline a frigideira para espalhar fina e uniformemente.
4. Cozinhe por 1-2 minutos até as bordas soltarem. Vire e cozinhe 30 segundos.
5. Repita com o restante da massa.
6. Recheie cada crepe com ricota adoçada e morangos.
7. Dobre em quatro ou enrole e sirva polvilhado com canela.

💡 Dica: A massa fina é o segredo – menos massa por crepe = mais crepes e textura ideal!`,
    notes: 'Sobremesa elegante que parece de confeitaria.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 50, unit: 'g', protein: 6.5 }, { food_name: 'Whey Protein Concentrado', quantity: 15, unit: 'g', protein: 12 }]
  },
  {
    id: 'rec-sob-3', name: 'Picolé Proteico de Iogurte e Frutas', category: 'Sobremesa', prep: 10, servings: 4,
    image_url: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (4 picolés):
• 200 g de iogurte grego natural
• 100 g de morangos frescos picados
• 1 banana amassada
• 1 colher de sopa de mel puro
• 1 colher de chá de extrato de baunilha
• Formas de picolé e palitos

MODO DE PREPARO:
1. Bata o iogurte com a banana, mel e extrato de baunilha no liquidificador.
2. Adicione os morangos picados e misture com colher (não bater para deixar pedaços).
3. Despeje nas forminhas de picolé, deixando 1 cm de espaço (expande ao congelar).
4. Encaixe os palitos e cubra com papel alumínio.
5. Congele por no mínimo 6 horas, preferencialmente durante a noite.
6. Para desenformar, passe a forminha rapidamente em água morna por 10 segundos.

💡 Dica: Varie as frutas por estação – manga + limão no verão e banana + canela no inverno!`,
    notes: 'Sobremesa gelada que agrada adultos e crianças.',
    ingredients: [{ food_name: 'Iogurte Grego Natural', quantity: 200, unit: 'g', protein: 20 }]
  },
  {
    id: 'rec-sob-4', name: 'Cheesecake Fit em Copinho', category: 'Sobremesa', prep: 20, servings: 4,
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (4 porções):
• MASSA: 60 g de castanha-do-pará triturada + 1 colher de mel
• RECHEIO: 200 g de creme de ricota light + 1 colher de adoçante + raspas de 1 limão
• COBERTURA: geleia de morango diet ou frutas frescas

MODO DE PREPARO:
1. Triture as castanhas grosseiramente no processador.
2. Misture com o mel e pressione no fundo de 4 copinhos (camada de ~1 cm). Leve à geladeira.
3. Bata o creme de ricota com adoçante, raspas de limão e 1 colher de suco de limão.
4. Se quiser mais firme, adicione 1/2 envelope de gelatina incolor dissolvida.
5. Distribua o creme sobre a base de castanhas nos copinhos.
6. Finalize com geleia diet ou frutas frescas fatiadas.
7. Refrigere por pelo menos 2 horas antes de servir.

💡 Dica: Faça na véspera para o cheesecake firmar completamente e os sabores integrarem!`,
    notes: 'Sofisticado, cremoso e sem culpa nenhuma.',
    ingredients: [{ food_name: 'Creme de Ricota Light', quantity: 80, unit: 'g', protein: 7.2 }, { food_name: 'Castanha-do-Pará', quantity: 15, unit: 'g', protein: 2.7 }]
  },
  {
    id: 'rec-sob-5', name: 'Nice Cream de Banana com Whey', category: 'Sobremesa', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 2 bananas maduras congeladas (descascadas)
• 1 scoop (20 g) de whey protein de qualquer sabor
• 1 colher de sopa de cacau 100% (para versão chocolate)
• 2-3 colheres de sopa de leite vegetal ou desnatado
• Canela a gosto

MODO DE PREPARO:
1. Descasque e corte as bananas em rodelas antes de congelar (mínimo 4 horas).
2. Coloque as bananas congeladas no processador.
3. Processe por 1-2 minutos, raspando as laterais ocasionalmente.
4. Adicione o whey, cacau e leite aos poucos.
5. Continue processando até obter textura de sorvete cremoso.
6. Sirva imediatamente para a textura de sorvete ou retorne ao freezer por 30 min para mais firmeza.

💡 Dica: Quanto mais madura a banana antes de congelar, mais doce o sorvete fica – sem açúcar!`,
    notes: 'Sorvete saudável com apenas frutas e whey.',
    ingredients: [{ food_name: 'Whey Protein Concentrado', quantity: 30, unit: 'g', protein: 24 }]
  },
  {
    id: 'rec-sob-6', name: 'Beijinho Proteico de Coco', category: 'Sobremesa', prep: 15, servings: 15,
    image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (15 unidades):
• 2 scoops (60 g) de whey protein sabor coco ou baunilha
• 3 colheres de sopa de leite em pó desnatado
• 2 colheres de sopa de coco ralado sem açúcar
• 2-3 colheres de sopa de água morna (para dar ponto)
• 1 colher de adoçante culinário
• Coco ralado para empanar

MODO DE PREPARO:
1. Em uma tigela, misture o whey com o leite em pó, coco ralado e adoçante.
2. Adicione a água morna aos poucos, misturando com as mãos até obter uma massa que desgrude das mãos.
3. Ajuste a consistência: mais água para amolecer, mais leite em pó para firmar.
4. Divida a massa em 15 porções iguais e modele bolinhas.
5. Passe cada bolinha no coco ralado.
6. Disponha em prato e leve à geladeira por 30 minutos.

💡 Dica: A massa deve estar úmida mas não pegajosa – como massa de modelar!`,
    notes: 'Docinho que imita o brigadeiro tradicional com proteína.',
    ingredients: [{ food_name: 'Whey Protein Concentrado', quantity: 30, unit: 'g', protein: 24 }]
  },
  {
    id: 'rec-sob-7', name: 'Pudim de Chia com Leite de Amêndoas', category: 'Sobremesa', prep: 10, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (2 porções):
• 300 ml de leite de amêndoas sem açúcar (ou desnatado)
• 3 colheres de sopa de sementes de chia
• 150 g de iogurte grego natural
• 1 colher de chá de extrato de baunilha
• 1 colher de adoçante
• Frutas frescas para finalizar

MODO DE PREPARO:
1. Em um recipiente com tampa, misture o leite com a chia, baunilha e adoçante.
2. Misture bem e deixe descansar por 5 minutos.
3. Mexa novamente para evitar que a chia grude em grumos.
4. Tampe e leve à geladeira por mínimo 4 horas (melhor de um dia para o outro).
5. Bata o iogurte grego com adoçante para fazer o creme.
6. Na hora de servir, distribua o pudim em taças e adicione o creme de iogurte.
7. Finalize com frutas frescas picadas.

💡 Dica: Prepare na noite anterior para ter um café da manhã ou sobremesa instantâneos!`,
    notes: 'Ômega-3 da chia + probióticos do iogurte = combo campeão.',
    ingredients: [{ food_name: 'Iogurte Grego Natural', quantity: 150, unit: 'g', protein: 15 }]
  },
  {
    id: 'rec-sob-8', name: 'Brownie Fit de Caneca', category: 'Sobremesa', prep: 5, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 1 ovo inteiro
• 1 colher de sopa de aveia em flocos finos
• 1 colher de sopa de cacau 100% em pó
• 1 colher de chá de adoçante culinário
• 1 colher de sopa de pasta de amendoim (deixa úmido)
• 1 pitada de sal e 1 pitada de fermento

MODO DE PREPARO:
1. Em uma caneca grande (300 ml), coloque a pasta de amendoim.
2. Adicione o ovo e misture bem com garfo.
3. Acrescente a aveia, cacau, adoçante, sal e fermento.
4. Misture até não ter grumos secos.
5. Leve ao micro-ondas por 1 minuto em potência máxima.
6. Teste espetando palito – se sair com alguns grumos úmidos, perfeito (não seque demais).
7. Deixe esfriar 1 minuto e sirva na própria caneca.

💡 Dica: O segredo do brownie úmido é a pasta de amendoim e não cozinhar tempo demais!`,
    notes: 'Pronto em 5 minutos. Elimina a vontade de doce de forma saudável.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 50, unit: 'g', protein: 6.5 }, { food_name: 'Aveia em Flocos', quantity: 15, unit: 'g', protein: 2.1 }]
  },
  {
    id: 'rec-sob-9', name: 'Tortinha de Maçã na Frigideira', category: 'Sobremesa', prep: 15, servings: 1,
    image_url: 'https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (1 porção):
• 1 maçã descascada em fatias finas
• 1 ovo
• 2 colheres de sopa de aveia em flocos
• 1 pitada de canela em pó e cravo
• 1 colher de chá de adoçante culinário
• 1 colher de chá de manteiga ou óleo de coco

MODO DE PREPARO:
1. Em frigideira antiaderente, derreta a manteiga em fogo médio.
2. Adicione as fatias de maçã dispostas em círculo, polvilhe adoçante e canela.
3. Cozinhe por 3-4 minutos até a maçã amolecer e caramelizar levemente.
4. Em uma tigela, bata o ovo com a aveia, uma pitada de canela e adoçante.
5. Despeje a massa por cima das maçãs na frigideira, cobrindo-as completamente.
6. Tampe a frigideira e cozinhe em fogo baixo por 5-7 minutos.
7. Vire com cuidado sobre um prato – as maçãs ficam por cima, como uma tatin.

💡 Dica: Fatie a maçã bem fininha para caramelizar uniformemente sem queimar!`,
    notes: 'Sobremesa quente que traz o conforto do outono.',
    ingredients: [{ food_name: 'Ovos Cozidos / Mexidos', quantity: 50, unit: 'g', protein: 6.5 }, { food_name: 'Aveia em Flocos', quantity: 20, unit: 'g', protein: 2.8 }]
  },
  {
    id: 'rec-sob-10', name: 'Mousse de Chocolate com Tofu', category: 'Sobremesa', prep: 10, servings: 2,
    image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80',
    instructions: `INGREDIENTES (2 porções):
• 200 g de tofu sedoso (silken tofu)
• 2 colheres de sopa de cacau 100% em pó
• 1 colher de adoçante culinário
• 1 colher de chá de extrato de baunilha
• 1 pitada de sal
• Raspas de laranja para intensificar o sabor (opcional)

MODO DE PREPARO:
1. Certifique-se de usar tofu sedoso (silken) – ele é diferente do firme e fica cremoso.
2. Coloque o tofu no processador ou liquidificador.
3. Adicione o cacau, adoçante, baunilha, sal e raspas de laranja.
4. Bata por 2-3 minutos até obter uma textura completamente lisa e cremosa.
5. Prove e ajuste o dulçor e intensidade do chocolate.
6. Distribua em taças individuais e refrigere por 1-2 horas.
7. Decore com raspas de chocolate 70% e hortelã fresca.

💡 Dica: Ninguém vai imaginar que é tofu! O sabor é totalmente dominado pelo cacau!`,
    notes: 'Mousse vegana surpreendentemente cremosa e rica.',
    ingredients: [{ food_name: 'Tofu Firme', quantity: 100, unit: 'g', protein: 15 }]
  }
];
