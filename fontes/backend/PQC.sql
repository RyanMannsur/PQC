drop table if exists Usuario cascade;
drop table if exists NotaFiscal cascade;
drop table if exists Produto cascade;
drop table if exists ProdutoItem cascade;
drop table if exists produtoOrgaoControle cascade;
drop table if exists MovtoEstoque cascade;
drop table if exists OrgaoControle cascade;
drop table if exists Campus cascade;
drop table if exists UnidadeOrganizacional cascade;
drop table if exists LocalEstocagem cascade;

CREATE TABLE usuario (
    codCPF CHAR(11) NOT NULL,
    nomUsuario char(50) not null,
    idtTipoUsuario char(1) not null CHECK (idtTipoUsuario IN ('A', 'R')),
    codCampus char(2), 
    codUnidade  char(8),
    codPredio char(2),
    codLaboratorio char(3),
    primary  key (codCPF)
);  
   
create table NotaFiscal ( 
   idNFe char(47) not null,
   txtJson json not null,
   primary key (idNFe)
);

create table Produto (
    codProduto serial not null,
    nomProduto varchar(128) not null,
    nomLista varchar(15) not null,
    perPureza decimal (5,2),
    vlrDensidade decimal  (5,2),
    idtAtivo boolean not null default True,
    ncm varchar(8), 
    primary key (codProduto)
);

create table ProdutoItem (
   codProduto int not null,
   seqItem    smallint not null,
   idNFe      varchar(47),
   datValidade date,
   codEmbalagem char(10),
   primary key (codProduto, seqItem)
);

create table OrgaoControle (
    codOrgaoControle smallint not null,
    nomOrgaoControle varchar(50) not null,
    primary key (codOrgaoControle)
);

-- Cada produto pode ser controlado por varios orgaos de controle
create table ProdutoOrgaoControle (
    codProduto int not null,
    codOrgaoControle smallint not null,
    primary key (codProduto, codOrgaoControle)
);

create table Campus (
    codCampus char(2) not null,
    nomCampus varchar(30) not null,
    primary key (codCampus)
);

-- Dependencia hierarquica de campus
create table UnidadeOrganizacional (
    codCampus char(2) not null,
    codUnidade  char(8) not null,
    sglUnidade  char(10) not null,
    nomUnidade varchar(80) not null,
    primary key (codCampus, codUnidade)
);

create table LocalEstocagem (
    codCampus char(2) not null, 
    codUnidade  char(8) not null,
    codPredio char(2) not null,
    codLaboratorio  char(3) not null,
    nomLocal varchar(100) not null,
    codCPFResponsavel char(11) not null,
    primary key (codCampus, codUnidade, codPredio, codLaboratorio)
);

-- #################################[ idtTipoMovto ]##########################################
-- Todos os produtos serão controlados por embalagem e terão número único em seu ciclo de vida
-- idtTipoMovto
--  IM implantação
--  EC entrada compra
--  ED entrada doacao
--  TE transferencia entrada
--  TS transferencia saida

--  IN inventario
--  AE Ajuste entrada 
--  AC ajuste consumo
--  
--  IMPLANTACAO
--  A primeira movimentação de todo produto é a implantação
--
--  ENTRADA
--  EC -> entrada via NFe
--  ED -> entrada via Doacao
--
--  INVENTARIO
--  Ao processar o inventário para todos os produtos serão gerados um IN -> com o saldo informado
--  a diferença entre o estoque atual e o estoque informado irá gerar:
--  AE -> se a diferença for positiva
--  AC -> se a diferença for negativa indicando o consumo
--
--  TRANSFERENCIA 
--  TOTAL: Quando se transfere uma embalagem inteira
--         TS -> do saldo na origem
--         TE -> do saldo no destino
--  PARCIAL: Quando um local de estocagem divide o conteúdo de uma emabalagem com um outro local
--         TS -> do quantidade transferida
--         IM -> implantação de uma nova embalagem a ser controlada
-- ##############################################################################################

create table MovtoEstoque (
    idMovtoEstoque serial not null,
    codProduto int not null,
    seqItem    smallint not null,
    codCampus char(2) not null,
    codUnidade char(8) not null,
    codPredio  char(2) not null,
    codLaboratorio char(3) not null,
    datMovto   date not null,
    idtTipoMovto char(2) not null,
    qtdEstoque	 decimal (7,3) not null,
    txtJustificativa text,
    primary key(idMovtoEstoque)
);

CREATE OR REPLACE FUNCTION desTipoMovto(p_idtTipoMovto VARCHAR)
RETURNS VARCHAR AS $$
BEGIN
    RETURN CASE p_idtTipoMovto
        WHEN 'IM' THEN 'Implantação'
        WHEN 'EC' THEN 'Entrada compra'
        WHEN 'ED' THEN 'Entrada doacao'
        WHEN 'TE' THEN 'Transferencia entrada'
        WHEN 'TS' THEN 'Transferencia saida'
        WHEN 'IN' THEN 'Inventario'
        WHEN 'AE' THEN 'Ajuste entrada'
        WHEN 'AC' THEN 'Ajuste consumo'
        ELSE 'Desconhecido' -- Caso o tipo de movimento não seja encontrado
       END;
END;
$$ LANGUAGE plpgsql;

-- Função para obter o próximo valor da sequência para PRODUTOITEM
-- #####################################################################
CREATE OR REPLACE FUNCTION public.get_next_produto_item_id(p_codProduto INTEGER)
RETURNS smallint AS $$
DECLARE
    next_id smallint;
BEGIN
  PERFORM pg_advisory_xact_lock(p_codProduto);
    -- Obtém o maior valor existente e adiciona 1
    SELECT COALESCE(max(seqItem), 0) + 1
      INTO next_id
      FROM ProdutoItem
     WHERE codProduto = p_codProduto;

    -- Retorna o próximo valor
    RETURN next_id;
END;
$$ LANGUAGE plpgsql;

-- Procedure para gerar o ID automaticamente
CREATE OR REPLACE FUNCTION public.generate_produto_item_id()
RETURNS TRIGGER AS $$
BEGIN
    -- Obtém o próximo valor da sequência e atribui ao novo registro
    NEW.seqItem := public.get_next_produto_item_id(NEW.codProduto);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Cria o trigger que será disparado antes de cada inserção na tabela produtoItem
CREATE OR REPLACE TRIGGER tr_generate_produto_item_id
BEFORE INSERT ON ProdutoItem
FOR EACH ROW
EXECUTE PROCEDURE public.generate_produto_item_id();
-- FIM ###########################################################################


-- Função para obter o próximo valor da sequência para ORGAOCONTROLE
-- #####################################################################
CREATE OR REPLACE FUNCTION public.get_next_orgao_controle_id()
RETURNS smallint AS $$
DECLARE
    next_id smallint;
BEGIN
    -- Obtém o maior valor existente e adiciona 1
    SELECT COALESCE(max(codOrgaoControle), 0) + 1
      INTO next_id
      FROM OrgaoControle;

    -- Retorna o próximo valor
    RETURN next_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar o ID automaticamente
CREATE OR REPLACE FUNCTION public.generate_orgao_controle_id()
RETURNS TRIGGER AS $$
BEGIN
    -- Obtém o próximo valor da sequência e atribui ao novo registro
    NEW.codOrgaoControle := public.get_next_orgao_controle_id();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Cria o trigger que será disparado antes de cada inserção na tabela orgaoControle
CREATE OR REPLACE TRIGGER tr_generate_orgao_controle_id
BEFORE INSERT ON OrgaoControle
FOR EACH ROW
EXECUTE PROCEDURE public.generate_orgao_controle_id();
-- FIM ###########################################################################


insert into usuario (codCPF, nomUsuario, idtTipoUsuario)
   values ('1', 'JÉSSICA OLIVEIRA SILVA', 'A'),
          ('2', 'THIAGO COTTA RIBEIRO (1045235)', 'R');
 

insert into Produto (nomProduto, nomLista, perPureza, vlrDensidade, ncm, idtAtivo)
    values
         ('1,2-DICLOROETANO', 'Lista II', 99.99, 1.30, '29031200',true),
         ('ACETATO DE ETILA', 'Lista II', 99.80, 0.90, '1', true),
         ('ACETONA', 'Lista II', 9.50, 0.79, '2', true),
         ( 'ÁCIDO ACÉTICO', 'Lista IV', 99.70, 1.05, '3', true),
         ('ÁCIDO BENZÓICO', 'Lista IV', 99.50, 1.27, '4', true),
         ( 'ÁCIDO BÓRICO e seus sais', 'Lista IV', 99.50, 1.44, '6', true),
         ( 'ÁCIDO BROMÍDRICO', 'Lista IV', 48.00, 1.49, '7', true),
         ( 'ÁCIDO CLORÍDRICO (37%)', 'Lista IV', 37.00, 1.19, '8', true),
         ('ÁCIDO CLORÍDRICO solução 0,1 N', 'Lista IV', 0.80, 1.01, '9', true),
         ( 'ÁCIDO CLORÍDRICO solução 1,0', 'Lista IV', 86.00, 1.20, '10', true),
         ( 'ÁCIDO FÓRMICO (98%)', 'Lista IV', 8.00, 1.01, '11', true),
         ( 'ÁCIDO FÓRMICO (86%)', 'Lista IV', 98.00, 1.22, '12', true),
         ( 'ÁCIDO SULFÚRICO', 'Lista IV', 98.00, 1.83, '13', true),
         ( 'ANIDO ACÉTICO', 'Lista VI', 99.00, 1.08, '14', true),
         ( 'BICARBONATO DE POTÁSSIO', 'Lista V', 100.00, 2.17, '15', true),
         ( 'SAFROL', 'Lista I', 97.00, 1.10, '16', true),
         ( '2, 2 DICLORO-DIETIL-METILAMINA (HN-2)', 'EXÉRCITO', null, null, '17', true),
         ( 'ÁCIDO BENZÍLICO (ÁCIDO-ALFA-HIDROXI-ALFA-FENIL-BENZENOACÉTICO; ÁCIDO 2,2-DIFENIL-2-HIDROXIACÉTICO)', 'EXÉRCITO', null, null, null, true),
         ( 'ÁCIDO FLUORÍDRICO (FLUORETO DE HIDROGÊNIO)', 'EXÉRCITO', null, null, null, true),
         ( 'TRIETANOLAMINA (TRI(2-HIDROXIETIL) AMINA)', 'EXÉRCITO', null, null, null, true);

insert into ProdutoItem (codProduto, seqItem, idNFe, datValidade, codEmbalagem)
    values
     (1, 1, null, '2025-12-31', 'C'),
     (1, 2, null, '2026-12-31', 'D');

insert into OrgaoControle (nomOrgaoControle)
     values
         ('Polícia Federal'),
         ('Exército'),
         ('ANVISA');

insert into ProdutoOrgaoControle (codProduto, codOrgaoControle)
    values
         (1, 1),
         (1, 2);

insert into Campus (codCampus, nomCampus)
    values
    ('NS', 'BH - NOVA SUIÇA'),
    ('NP', 'NEPOMUCENO (NP)'),
    ('CN', 'CONTAGEM (CN)'),
    ('CV', 'CURVELO (CV)'),
    ('NG', 'BH - NOVA GAMELEIRA (NG)'),
    ('AX', '1 - ARAXÁ (AX)'),
    ('DV', 'DIVINÓPOLIS (DV)'),
    ('LP', 'LEOPOLDINA (LP)'),
    ('VG', 'VARGINHA (VG)'),
    ('TM', 'TIMÓTEO (TM)'),
    ('GM', 'BH - GAMELEIRA');

insert into UnidadeOrganizacional 
    (codCampus, codUnidade, sglUnidade, nomUnidade)
    values
     ('NS', '11.52.11', 'CDIP_NS', 'COORDENAÇÃO DE DESENVOLVIMENTO DA INFRAESTRUTURA DE PESQUISA'),
     ('NS', '11.55.12', 'DCB_NS', 'DEPARTAMENTO DE CIÊNCIAS BIOLÓGICAS'),
     ('NP', '11.62.05', 'DCM_NP', 'DEPARTAMENTO DE COMPUTAÇÃO E MECÂNICA'),
     ('NS', '11.55.03', 'DCTA_NS', 'DEPARTAMENTO DE CIÊNCIA E TECNOLOGIA AMBIENTAL'),
     ('CN', '11.58.05', 'DECAQ_CN', 'DEPARTAMENTO DE CONTROLE AMBIENTAL E QUÍMICA'),
     ('CV', '11.59.04', 'DECM_CV', 'DEPARTAMENTO DE ENGENHARIA CIVIL E MEIO AMBIENTE'),
     ('NG', '11.56.12', 'DEEB_NG', 'DEPARTAMENTO DE ELETRÔNICA E BIOMÉDICA'),
     ('AX', '11.57.05', 'DELM_AX', 'DEPARTAMENTO DE ELETROMECÂNICA'),
     ('NS', '11.55.06', 'DEMAT_NS', 'DEPARTAMENTO DE ENGENHARIA DE MATERIAIS'),
     ('NG', '11.55.09', 'DEQUI_NG', 'LABORATÓRIO DE QUÍMICA'),
     ('NS', '11.55.09', 'DEQUI_NS', 'DEPARTAMENTO DE QUÍMICA'),
     ('NS', '11.55.11', 'DET_NS', 'DEPARTAMENTO DE ENGENHARIA DE TRANSPORTES'),
     ('AX', '11.57.03', 'DFG_AX', 'DEPARTAMENTO DE FORMAÇÃO GERAL'),
     ('CV', '11.59.03', 'DFG_CV', 'DEPARTAMENTO DE FORMAÇÃO GERAL'),
     ('DV', '11.60.03', 'DFG_DV', 'DEPARTAMENTO DE FORMAÇÃO GERAL'),
     ('LP', '11.61.03', 'DFG_LP', 'DEPARTAMENTO DE FORMAÇÃO GERAL'),
     ('NP', '11.62.03', 'DFG_NP', 'DEPARTAMENTO DE FORMAÇÃO GERAL'),
     ('VG', '11.64.03', 'DFG_VG', 'DEPARTAMENTO DE FORMAÇÃO GERAL'),
     ('AX', '11.57.04', 'DMC_AX', 'DEPARTAMENTO DE MINAS E CONSTRUÇÃO CIVIL'),
     ('TM', '11.63.04', 'DMQ_TM', 'DEPARTAMENTO DE METALURGIA E QUÍMICA)'),
     ('NG', '11.52.06', 'PPGEC_NG', 'PROGRAMA DE PÓS-GRADUAÇÃO EM ENGENHARIA CIVIL'),
     ('NG', '11.52.08', 'PPGEL_NG', 'PROGRAMA DE PÓS-GRADUAÇÃO EM ENGENHARIA ELÉTRICA'),
     ('GM', '11.52.12', 'PPGMQ_GM', 'PROGRAMA DE PÓS-GRADUAÇÃO MULTICÊNTRICO EM QUÍMICA'),
     ('GM', '11.52.15', 'PPGTPP_GM', 'PROGRAMA DE PÓS-GRADUAÇÃO EM TECNOLOGIA DE PRODUTOS E PROCESSOS');

insert into LocalEstocagem (codCampus, codUnidade, codPredio, codLaboratorio, nomLocal, codCPFResponsavel)
    values
     ('NS', '11.52.11', '01', '101', 'ENTRADA ESTOQUE', '1'),
     ('NG', '11.56.12', '17', '101', 'Laboratório de Química', '1'),
     ('NS', '11.55.11', '01', '001', 'COORDENAÇÃO DE DESENVOLVIMENTO DA INFRAESTRUTURA DE PESQUISA', '1'),
     ('NS', '11.55.11', '11', '102', 'DEPARTAMENTO DE CIÊNCIAS BIOLÓGICAS', '2'),
     ('NP', '11.62.05', '20', '051', 'DEPARTAMENTO DE COMPUTAÇÃO E MECÂNICA', '2'),
     ('NS', '11.55.11', '11', '141', 'DEPARTAMENTO DE CIÊNCIA E TECNOLOGIA AMBIENTAL', '2'),
    ('AX','11.57.03','01','001','DEPARTAMENTO DE FORMAÇÃO GERAL- (DFG_AX)', 1);
   




Alter table ProdutoItem add foreign key (codProduto)
      references Produto (codProduto);

Alter table ProdutoOrgaoControle add foreign key (codProduto)
      references produto (codProduto) on delete cascade;
Alter table ProdutoOrgaoControle add foreign key    
   (codOrgaoControle)
      references OrgaoControle (codOrgaoControle);

Alter table  UnidadeOrganizacional add foreign key (codCampus)
      references Campus (codCampus);

Alter table LocalEstocagem add foreign key (codCampus, codUnidade)
      references UnidadeOrganizacional (codCampus, codUnidade);

Alter table MovtoEstoque add foreign key (codProduto, seqItem)
       references ProdutoItem (codProduto, seqItem);
Alter table MovtoEstoque add foreign key 
            (codCampus, codUnidade, codPredio, codLaboratorio)
       references LocalEstocagem 
            (codCampus, codUnidade, codPredio, codLaboratorio);

Alter table ProdutoItem add foreign key (idNFE)
       references NotaFiscal (idNFE);

