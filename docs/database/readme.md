# Projeto de Banco de Dados - BayArchon

## Sobre Este Arquivo

Este documento descreve a arquitetura, organização, padrões de desenvolvimento e práticas adotadas no banco de dados do sistema Bay Form Flow.

O objetivo desta documentação é servir como referência técnica para desenvolvedores, administradores de banco de dados (DBAs) e demais colaboradores envolvidos na manutenção e evolução do projeto.

---

## Sumário

- Ficha Técnica do Banco de Dados
- Domínios de Negócio
- Integrações
- Versionamento
- Observabilidade
- Política de Backup
- Considerações de Evolução
- Convenções do Projeto
- Criação de Objetos em Geral
- Organização de Arquivos
- Ordem de Colunas na Criação de Tabelas
- Nomenclaturas de Objetos
- Principios Gerais
- Prefixos dos Objetos
- Prefixos das Constraints
- Nomenclatura de Colunas de Chaves Estrangeiras
- Nomenclaturas de CONSTRAINTs Nomeáveis
- Nomenclaturas de Triggers
- Equipe Responsável

---

## Ficha Técnica do Banco de Dados

| Item | Descrição |
|-------|-----------|
| **SGBD** | PostgreSQL |
| **Plataforma** | Supabase |
| **Versionamento** | Flyway |
| **Linguagem SQL** | PostgreSQL SQL / PLpgSQL |
| **Controle de Código** | Git + GitHub |
| **Armazenamento de Arquivos** | Supabase Storage |
| **Autenticação** | Supabase Auth |
| **Modelo de Chaves** | UUID | INT | SMALLINT | BIGINT
| **Auditoria** | Triggers + Logs |
| **Exclusão Lógica** | Soft Delete |

---

## Domínios de Negócio

O projeto foi organizado em sete domínios de negócio, sendo que cada domínio corresponde a um schema específico no banco de dados. Essa organização tem como objetivo separar responsabilidades, facilitar a manutenção e promover maior escalabilidade da aplicação. A seguir, são apresentadas as descrições de cada um deles.

- **Logins:** responsável pelo gerenciamento das entidades que passam por autenticação no uso do sistema.

- **Consultants:** responsável pelo armazenamento das informações relacionadas aos funcionarios que atuam no sistema e seus ligação com os projetos de auditoria da empresa.

- **Requesters:** responsável pelo armazenamento das informações das empresas clientes e dos entrevistados delimitados por elas.

- **Consultancies:** responsável pelo armazenamento de tudo relacionado ao processo de auditoria dirigido pela empresa. Inclui pesquisas, formularios, versão dos formularios, respostas e tabelas auxiliares.

- **Compliance:** responsável pelo armazenamento dos termos que devem ser lidos e aceitados pelos usuarios e entrevistados do sistema.

- **Notifications:** responsável pelo armazenamento e atrelação das notificações geradas por ações do sistema aos usuarios relacionados.

- **Logs:** responsável pelo armazenamento de todas as ações que afetem os dados do banco. Possibilita uma auditoria mais geral e centralizada.

## Integrações

O banco de dados comunica-se com os serviços utilizados pelo sistema, sendo responsável pelo armazenamento e gerenciamento das informações da aplicação. As principais integrações são realizadas com a API da aplicação e com os serviços disponibilizados pela plataforma Supabase.

**Supabase Auth:** responsável pelo gerenciamento da autenticação dos usuários do sistema, armazenando as credenciais e informações de acesso.

**Supabase Storage:** responsável pelo armazenamento dos arquivos associados as evidencias enviadas pelos entrevistados ao responderem os formularios, mantendo a separação entre os metadados armazenados no banco de dados e os arquivos físicos.

A comunicação entre esses componentes permite o funcionamento integrado da aplicação, garantindo a consistência das informações e a segurança dos dados armazenados.

## Versionamento

O código-fonte do banco de dados é versionado utilizando o GitHub, de modo que o repositório reflita continuamente o estado atual do banco de dados implantado.

Todas as alterações estruturais são realizadas por meio de migrations gerenciadas pela ferramenta Flyway, garantindo rastreabilidade, controle de versões e padronização no processo de evolução do banco de dados.

Cada migration representa uma alteração específica na estrutura do banco, como criação ou modificação de schemas, tabelas, funções, triggers, índices, constraints e permissões. As migrations seguem uma numeração sequencial e são executadas na ordem de sua versão, assegurando que todos os ambientes permaneçam sincronizados.

Esse processo permite a reconstrução do banco de dados de forma consistente, além de facilitar a manutenção, o controle das alterações e o trabalho colaborativo entre os desenvolvedores.

## Observabilidade

O banco de dados possui mecanismos de observabilidade voltados ao acompanhamento das operações realizadas e à auditoria das informações armazenadas.

A rastreabilidade das ações é garantida por meio de registros automáticos de auditoria, implementados através de funções e triggers responsáveis por registrar eventos relevantes, como inserções, atualizações, exclusões lógicas e alterações de estado das entidades do sistema.

Além disso, a plataforma Supabase disponibiliza ferramentas para monitoramento da instância do banco de dados, permitindo acompanhar métricas de utilização, desempenho, execução de consultas e registros de logs operacionais, auxiliando na identificação de falhas e na manutenção da integridade do ambiente.

## Política de Backup

O banco de dados utiliza o mecanismo de backup automático disponibilizado pela plataforma Supabase.

Os projetos dos planos Pro possuem backups diários automáticos, com disponibilidade dos últimos 7 dias de backups para restauração. Os backups podem ser consultados e restaurados por meio da seção de backups do banco de dados no painel do Supabase. 

Esse mecanismo permite a recuperação do banco de dados a partir de um dos backups disponíveis, contribuindo para a proteção dos dados contra falhas ou perda acidental.

Para necessidades de recuperação mais precisas, o Supabase também disponibiliza o Point-in-Time Recovery (PITR) como recurso adicional, permitindo a recuperação para um ponto específico no tempo dentro do período de retenção configurado. 

Os backups do banco de dados referem-se aos dados armazenados no PostgreSQL. Os objetos armazenados por meio do Supabase Storage não são incluídos diretamente nesses backups, sendo necessário considerar mecanismos específicos de proteção e recuperação para os arquivos armazenados.

## Considerações de Evolução

Com o crescimento do banco de dados e da utilização do sistema, recomenda-se a adoção das seguintes melhorias:

- Implementação de rotinas automatizadas de backup e recuperação de dados;

- Expansão da cobertura dos logs de auditoria para contemplar todas as entidades do sistema;

- Implementação e aprimoramento de políticas de segurança e controle de acesso (Row-Level Security - RLS), quando aplicável;

- Monitoramento contínuo do desempenho do banco de dados, com revisão e otimização de índices e consultas conforme o aumento do volume de dados;

- Revisão periódica das funções, triggers e constraints, visando garantir a integridade dos dados e facilitar futuras manutenções;

- Atualização contínua da documentação técnica e do dicionário de dados, assegurando que reflitam a estrutura atual do banco de dados.

## Convenções do Projeto

Nas seções a seguir são apresentadas as convenções adotadas durante o desenvolvimento do banco de dados, com o objetivo de garantir organização, padronização, integridade, segurança, rastreabilidade e facilidade de manutenção ao longo do ciclo de vida do projeto.

Todas as novas implementações devem seguir os padrões descritos nesta documentação. Alterações nas convenções estabelecidas devem ser previamente analisadas e aprovadas pela equipe responsável pelo desenvolvimento do banco de dados.

---

## Criação de Objetos em Geral

As seguintes diretrizes devem ser observadas durante a criação de novos objetos no banco de dados:

- Nenhum objeto deve ser criado no schema `public`;

- Todo objeto deve ser criado no schema correspondente ao seu domínio de negócio;

- Funções reutilizáveis devem ser criadas no schema `helpers`;

- Enumerações (`ENUMs`) devem ser criadas no schema ao qual pertencem, evitando dependências desnecessárias entre domínios;

- Tabelas, índices, constraints, triggers e demais objetos devem permanecer organizados de acordo com o schema responsável pela funcionalidade implementada;

- Todo novo objeto deve possuir nomenclatura padronizada e documentação compatível com as convenções do projeto;

- Alterações estruturais devem ser realizadas exclusivamente por meio de migrations gerenciadas pelo Flyway.

## Organização de Arquivos

A organização dos arquivos do projeto segue o padrão de versionamento adotado pelo Flyway, no qual cada alteração estrutural é implementada por meio de uma migration específica.

As seguintes diretrizes devem ser observadas:

- Cada migration deve representar uma única alteração lógica no banco de dados, facilitando sua rastreabilidade e manutenção;

- As migrations devem seguir a convenção de nomenclatura `V<versão>__<descrição>.sql`, utilizando numeração sequencial e descrições objetivas;

- Enumerações (`ENUMs`), tabelas, índices, constraints, triggers e demais objetos devem ser criados na migration correspondente à funcionalidade implementada, mantendo a organização e a legibilidade do histórico de versões;

- Scripts de concessão de permissões (`GRANT`) e demais configurações de segurança devem ser versionados por meio de migrations específicas, facilitando o controle das alterações de acesso;

- Toda nova funcionalidade deve possuir sua própria migration, evitando alterações diretas em scripts já executados e preservando a consistência do histórico do banco de dados.

## Ordem de Colunas na Criação de Tabelas

As colunas das tabelas devem ser declaradas seguindo a ordem abaixo, visando garantir padronização, legibilidade e facilitar a manutenção do banco de dados.

1. Chave primária, sem a declaração de sua `CONSTRAINT`;

2. Colunas contendo os dados da entidade.

3. Colunas de auditoria, nesta ordem:
   - `created_at`;
   - `updated_at`;

   Caso alguma dessas colunas não seja aplicável à tabela, ela poderá ser omitida.

4. Colunas de controle da entidade, nesta ordem:
   - `deleted_at`
   - `is_deleted`

5. Chaves estrangeiras, sem a declaração de suas respectivas `CONSTRAINTs`.

6. Declaração da `CONSTRAINT` de chave primária (`PRIMARY KEY`).

7. Declarações das `CONSTRAINTs` de chaves primárias compostas, quando aplicáveis.

8. Declarações das `CONSTRAINTs` de chaves únicas (`UNIQUE`).

9. Declarações das `CONSTRAINTs` de chaves únicas compostas, quando aplicáveis.

10. Declarações das demais `CONSTRAINTs`, como `CHECK` e `EXCLUDE`, quando aplicáveis.

11. Declarações das `CONSTRAINTs` de chaves estrangeiras.

12. Declarações das `CONSTRAINTs` de chaves estrangeiras compostas, quando aplicáveis.


As etapas que não se aplicarem à estrutura da tabela podem ser omitidas.

## Nomenclaturas de Objetos

### Princípios Gerais

As nomenclaturas dos objetos do banco de dados devem seguir padrões que garantam consistência, legibilidade e facilidade de manutenção ao longo do projeto.

As seguintes convenções devem ser respeitadas:

- Utilizar o caractere underscore (`_`) para separar palavras;

- Utilizar apenas letras minúsculas (`lowercase`);

- Utilizar nomes descritivos e objetivos;

- As tabelas devem ser nomeadas no plural, conforme o padrão adotado pelo projeto;

- Utilizar preferencialmente o idioma inglês para nomes de objetos, colunas e demais elementos do banco de dados;

- Evitar abreviações que possam comprometer a compreensão do objeto.

---

### Prefixos dos Objetos

Todos os objetos devem seguir os prefixos abaixo.

| Objeto | Prefixo | 
|---------|:-------:|
| Tabela | `t_` | 
| Trigger | `trg_` | 
| View | `v_` | 
| Materialized View | `mv_` | 
| Índice | `idx_` |
| Índice Unico Parcial | `idxuqpt_` |
| Sequence | `seq_` | 
| Procedure | `p_` | 
---

### Prefixos das Constraints

As constraints devem seguir a nomenclatura abaixo.

| Constraint | Prefixo |
|------------|:-------:|
| Primary Key | `pk_` | 
| Foreign Key | `fk_` | 
| Unique | `uq_` | 
| Check | `ck_` | 
| Exclude | `ex_` | 

---

### Nomenclatura de Colunas de Chaves Estrangeiras

As colunas que representam chaves estrangeiras (Foreign Keys) devem seguir um padrão simples e padronizado, facilitando sua identificação e manutenção.

A nomenclatura deve ser composta pelo nome do schema em que está contido, nome da tabela que referencia, prefixo e nome da coluna que contem`.

**Padrão:**

```text
<schema>_<tabela>_fk_<coluna>
```

**Exemplos:**

```text
logins_t_users_fk_created_by

consultants_t_employees_researchs_fk_research_id

```

# Nomenclaturas de CONSTRAINTs Nomeáveis

As `CONSTRAINTs` nomeáveis devem utilizar um prefixo que identifique seu tipo, seguido pelo nome da tabela e, quando aplicável, pelo nome da coluna ou das colunas envolvidas.

O padrão geral de nomenclatura é:

```text
<schema>_<nome_tabela>_<sigla_constraint>_<nome_coluna>
```

Para `CONSTRAINTs` compostas, os nomes das colunas envolvidas devem ser adicionados à nomenclatura.

Exemplos:

```text
requesters_t_companies_ck_phonenumber

consultancies_t_form_versions_pk

```

---

# Nomenclaturas de Triggers

As triggers devem utilizar o nome do schema, seguido pelo nome da tabela, o prefixo `trg_` e do nome da operação realizada.

O padrão adotado é:

```text
<schema>_<nome_tabela>_trg_<operacao>
```

Exemplos:

```text
requesters_t_interviwee_trg_update_updated_at

logs_t_logs_trg_research_created

```

As triggers devem ser nomeadas de forma clara e objetiva, permitindo identificar a operação realizada e a finalidade do mecanismo.

---

# Equipe Responsável

Este projeto de banco de dados foi desenvolvido pela equipe responsável pelo desenvolvimento do sistema, contemplando a modelagem, implementação e manutenção da estrutura do banco de dados.

A responsabilidade pelo desenvolvimento e manutenção do banco de dados é atribuída à equipe de desenvolvimento, com destaque para **Augusto Andrade da Silva**, responsável pela modelagem e implementação do banco de dados.

Para dúvidas técnicas, contribuições ou solicitações relacionadas à manutenção e evolução do banco de dados, entrar em contato pelo email 0o0musiquinha@gmail.com.