-- FIAP Teacher Hub — seed de dados (Prof. Marcos Silva)
-- Espelha fielmente os dados de exemplo do preview/index.html.
-- Rodar depois de schema.sql.
--
-- Observação: para o professor de teste logar de fato via Supabase Auth,
-- crie o usuário primeiro pelo Dashboard (Authentication > Add user) ou via
-- supabase.auth.admin.createUser({ email: 'm.silva@fiap.com.br', password: '1234' })
-- usando o mesmo UUID abaixo (00000000-0000-0000-0000-000000000001), e só então
-- rode este arquivo. O insert em auth.users comentado abaixo é um atalho que
-- funciona em ambiente local (supabase start) mas não é a via recomendada em produção.

-- insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
-- values ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated',
--         'm.silva@fiap.com.br', crypt('1234', gen_salt('bf')), now(), now(), now());

-- =========================================================
-- PROFESSOR
-- =========================================================
insert into professores (id, nome, email, matricula, usuario, unidades) values
('00000000-0000-0000-0000-000000000001', 'Prof. Marcos Silva', 'm.silva@fiap.com.br', 'P-00482', 'pf0001', '{"Lins","Paulista"}');

-- =========================================================
-- TURMAS
-- (as 4 citadas no briefing + as demais 2 exibidas na tela Turmas do preview)
-- =========================================================
insert into turmas (id, nome, codigo, unidade, sala, andar, horario, dias_semana, professor_id) values
('10000000-0000-0000-0000-000000000001', 'Eng. de Software',        '1TDSB', 'Lins',     '305', '3º andar', '08h–10h', '{"Seg","Qua"}', '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000002', 'DevOps & Cloud',          '2TDSA', 'Lins',     '207', '2º andar', '10h–12h', '{"Seg","Sex"}', '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000003', 'Ciência de Dados',        '1TDSR', 'Lins',     '106', '1º andar', '08h–10h', '{"Ter","Qui"}', '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000004', 'Arquitetura Java',        '3TDSR', 'Paulista', '402', '4º andar', '19h–21h', '{"Ter","Qui"}', '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000005', 'Mobile Development',      '2TDSB', 'Paulista', '503', '5º andar', '21h–23h', '{"Qua","Sex"}', '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000006', 'Redes de Computadores',   '1TDSS', 'Paulista', '305', '3º andar', '19h–21h', '{"Seg","Qua"}', '00000000-0000-0000-0000-000000000001');

-- =========================================================
-- ALUNOS (referenciados no chat da aba Contato > Alunos)
-- =========================================================
insert into alunos (id, nome, rm, turma_id) values
('20000000-0000-0000-0000-000000000001', 'Ana Gabriela',    'RM-90001', '10000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000002', 'Pedro Viana',     'RM-90002', '10000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000003', 'Larissa Ferreira','RM-90003', '10000000-0000-0000-0000-000000000003'),
('20000000-0000-0000-0000-000000000004', 'Carlos Mendes',   'RM-90004', '10000000-0000-0000-0000-000000000001');

-- =========================================================
-- AULAS (agenda — semana de referência do preview, Junho/2026)
-- =========================================================
insert into aulas (turma_id, data, horario_inicio, horario_fim, sala, tipo) values
('10000000-0000-0000-0000-000000000001', '2026-06-09', '08:00', '10:00', '305', 'normal'),
('10000000-0000-0000-0000-000000000002', '2026-06-09', '10:00', '12:00', '207', 'normal'),
('10000000-0000-0000-0000-000000000004', '2026-06-09', '19:00', '21:00', '402', 'normal'),
('10000000-0000-0000-0000-000000000005', '2026-06-09', '21:00', '23:00', '503', 'normal'),
('10000000-0000-0000-0000-000000000002', '2026-06-10', '10:00', '12:00', '207', 'normal'),
('10000000-0000-0000-0000-000000000005', '2026-06-10', '21:00', '23:00', '503', 'normal'),
('10000000-0000-0000-0000-000000000001', '2026-06-12', '08:00', '10:00', '305', 'normal'),
('10000000-0000-0000-0000-000000000004', '2026-06-12', '19:00', '21:00', '402', 'normal'),
('10000000-0000-0000-0000-000000000001', '2026-06-16', '08:00', '10:00', '305', 'normal'),
('10000000-0000-0000-0000-000000000004', '2026-06-16', '19:00', '21:00', '402', 'normal');

-- =========================================================
-- AVALIAÇÕES (status CP1/CP2/GS por turma, conforme tela Turmas/Aula)
-- =========================================================
insert into avaliacoes (turma_id, tipo, status) values
('10000000-0000-0000-0000-000000000001', 'CP1', 'lancado'),
('10000000-0000-0000-0000-000000000001', 'CP2', 'pendente'),
('10000000-0000-0000-0000-000000000002', 'CP1', 'lancado'),
('10000000-0000-0000-0000-000000000002', 'CP2', 'lancado'),
('10000000-0000-0000-0000-000000000003', 'CP1', 'lancado'),
('10000000-0000-0000-0000-000000000003', 'CP2', 'pendente'),
('10000000-0000-0000-0000-000000000004', 'CP1', 'lancado'),
('10000000-0000-0000-0000-000000000005', 'CP1', 'lancado'),
('10000000-0000-0000-0000-000000000006', 'CP1', 'lancado'),
('10000000-0000-0000-0000-000000000006', 'CP2', 'pendente');

-- =========================================================
-- CHAMADOS + TIMELINE
-- =========================================================
insert into chamados (id, professor_id, setor, descricao, status, sala, created_at) values
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'TI', 'Aluno não consegue logar', 'em_andamento', 'Sala 305 · 3º andar · Lins', now() - interval '12 minutes'),
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Audiovisual', 'Projetor não está funcionando', 'aberto', 'Sala 305 · 3º andar · Lins', now() - interval '10 minutes');

insert into chamados_timeline (chamado_id, autor, mensagem, created_at) values
('30000000-0000-0000-0000-000000000001', 'Prof. Marcos Silva', 'Aluno RM-12345 não consegue acessar o sistema.', now() - interval '12 minutes'),
('30000000-0000-0000-0000-000000000001', 'Monitor Pedro (TI)', 'Chamado recebido! Verificando o sistema.', now() - interval '10 minutes'),
('30000000-0000-0000-0000-000000000001', 'Monitor Pedro (TI)', 'Conta bloqueada por excesso de tentativas. Estou indo até a sala agora.', now() - interval '5 minutes'),
('30000000-0000-0000-0000-000000000002', 'Prof. Marcos Silva', 'Projetor ligado mas sem imagem. Já testei o HDMI.', now() - interval '10 minutes'),
('30000000-0000-0000-0000-000000000002', 'Sistema', 'Chamado encaminhado para Audiovisual.', now() - interval '9 minutes');

-- =========================================================
-- MENSAGENS (chat professor <-> alunos)
-- =========================================================
insert into mensagens (professor_id, aluno_id, remetente, texto, lida, created_at) values
('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'aluno', 'Professor, tenho uma dúvida sobre a CP2. O prazo é mesmo até sexta?', false, now() - interval '40 minutes'),
('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'aluno', 'Porque no AVA está escrito sexta mas a monitora disse que é quinta.', false, now() - interval '39 minutes'),
('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'professor', 'Boa observação, Ana. O prazo correto é sexta-feira às 23h59. Vou corrigir no AVA.', true, now() - interval '30 minutes'),
('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'aluno', 'Professor, posso entregar o trabalho de DevOps amanhã? Tive um problema pessoal hoje.', false, now() - interval '55 minutes'),
('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'aluno', 'Já tenho 90% pronto, só falta a documentação.', false, now() - interval '53 minutes'),
('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'aluno', 'Professor, já enviei o link do repositório GitHub com o projeto de Ciência de Dados!', true, now() - interval '1 day'),
('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'professor', 'Ótimo, Larissa! Vou dar uma olhada ainda hoje.', true, now() - interval '1 day' + interval '10 minutes'),
('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 'aluno', 'Professor, quando sai o resultado do CP1?', true, now() - interval '1 day');

-- =========================================================
-- AVISOS
-- =========================================================
insert into avisos (professor_id, turma_id, texto, created_at) values
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'CP2 na próxima aula. Revisem módulos 4 e 5 do AVA.', now() - interval '2 hours'),
('00000000-0000-0000-0000-000000000001', null, 'Entrega do Challenge: 20/06. Verifiquem os requisitos no AVA.', now() - interval '3 days');

-- =========================================================
-- SOLICITAÇÕES À COORDENAÇÃO
-- =========================================================
insert into solicitacoes_coordenacao (professor_id, motivo, detalhes, status, created_at) values
('00000000-0000-0000-0000-000000000001', 'Mudança de sala (excesso de alunos)', 'Sala 305 → Lab 207', 'aprovada', '2026-05-28'),
('00000000-0000-0000-0000-000000000001', 'Mudança de sala (excesso de alunos)', 'Turma 2TDSB com 29 alunos', 'em_analise', '2026-06-02');
