CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    token TEXT NOT NULL DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isADM BOOLEAN DEFAULT FALSE,
    CONSTRAINT unique_token UNIQUE (token)
);

INSERT INTO usuario (cpf, senha, isADM)
VALUES
('123.456.789-01', 'Senha@123', FALSE),
('123.456.789-02', 'Senha@124', FALSE),
('123.456.789-03', 'Senha@125', FALSE),
('123.456.789-04', 'Senha@126', FALSE),
('123.456.789-05', 'Senha@127', FALSE),
('123.456.789-06', 'Senha@128', FALSE),
('123.456.789-07', 'Senha@129', FALSE),
('123.456.789-08', 'Senha@130', FALSE),
('123.456.789-09', 'Senha@131', FALSE),
('123.456.789-10', 'Senha@132', FALSE),
('123.456.789-11', 'Senha@133', FALSE),
('123.456.789-12', 'Senha@134', FALSE),
('123.456.789-13', 'Senha@135', FALSE),
('123.456.789-14', 'Senha@136', FALSE),
('123.456.789-15', 'Senha@137', FALSE),
('123.456.789-16', 'Senha@138', FALSE),
('123.456.789-17', 'Senha@139', FALSE),
('123.456.789-18', 'Senha@140', FALSE),
('123.456.789-19', 'Senha@141', FALSE),
('123.456.789-20', 'Senha@142', FALSE),
('123.456.789-21', 'Senha@143', FALSE),
('123.456.789-22', 'Senha@144', FALSE),
('123.456.789-23', 'Senha@145', FALSE),
('333.333.333-33', 'PQC1*', TRUE);

create table NotaFiscal (
   idNFe serial not null,
   txtXML text not null,
   primary key (idNFe)
);

-- Tabela de Unidade de Medida
CREATE TABLE UnidadeMedida (
    idUnidadeMedida SERIAL PRIMARY KEY,
    sigla VARCHAR(10) NOT NULL,
    nome VARCHAR(50) NOT NULL
);


create table Embalagem (
    codEmbalagem smallint not null,
    nomEmbalagem varchar(30) not null,
    qtdCapacidade decimal (7,3) not null,
    primary key (codEmbalagem)
);

create table Produto (
    codProduto serial not null,
    nomProduto varchar(128) not null,
    nomLista varchar(15) not null,
    perPureza decimal (5,2),
    vlrDensidade decimal  (5,2),
    idtAtivo boolean,
    ncm varchar(8),
    primary key (codProduto)
);


create table ProdutoItem (
   codProduto int not null,
   seqItem    smallint not null,
   idNFe      int,
   datValidade date,
   codEmbalagem char(5) not null,
   primary key (codProduto, seqItem)
);

create table OrgaoControle (
    codOrgaoControle char(5) not null,
    nomOrgaoControle varchar(50) not null,
    primary key (codOrgaoControle)
);

-- Cada produto pode ser controlado por varios orgaos de controle
create table ProdutoOrgaoControle (
    codProduto int not null,
    codOrgaoControle char(5) not null,
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
    codSiapeResponsavel int not null,
    primary key (codCampus, codUnidade, codPredio, codLaboratorio)
);

CREATE TABLE usuariolocalestocagem (
    token TEXT NOT NULL,
    codCampus CHAR(2) NOT NULL,
    codUnidade CHAR(8) NOT NULL,
    codPredio CHAR(2) NOT NULL,
    codLaboratorio CHAR(3) NOT NULL,
    PRIMARY KEY (token, codCampus, codUnidade, codPredio, codLaboratorio),
    CONSTRAINT fk_usuario_token FOREIGN KEY (token) REFERENCES usuario (token) ON DELETE CASCADE,
    CONSTRAINT fk_localestocagem FOREIGN KEY (codCampus, codUnidade, codPredio, codLaboratorio)
        REFERENCES LocalEstocagem (codCampus, codUnidade, codPredio, codLaboratorio) ON DELETE CASCADE
);

-- Tabela de Transporte
CREATE TABLE Transporte (
    idTransporte SERIAL PRIMARY KEY,
    descricao VARCHAR(255),
    responsavel VARCHAR(255),
    cpfResponsavel VARCHAR(20)
);


-- idtTipoMovto
--  IM implantação
--  EC entrada compra
--  ED entrada doacao
--  TE transferencia entrada
--  TS transferencia saida
--  IN inventario

--  AE Ajuste entrada --> Falta de registrro entrada NFe/Doacao
--  AC ajuste consumo
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

CREATE TABLE MovtoEstoqueTransporte (
    idMovtoEstoque INT REFERENCES MovtoEstoque(idMovtoEstoque) ON DELETE CASCADE,
    idTransporte INT REFERENCES Transporte(idTransporte) ON DELETE CASCADE,
    PRIMARY KEY (idMovtoEstoque, idTransporte)
);

-- Tabela de Fornecedor (chave primária: cnpj)
CREATE TABLE Fornecedor (
    cnpj VARCHAR(20) PRIMARY KEY,
    razaoSocial VARCHAR(255)
);

CREATE TABLE MovtoEstoqueFornecedor (
    idMovtoEstoque INT REFERENCES MovtoEstoque(idMovtoEstoque) ON DELETE CASCADE,
    cnpj VARCHAR(20) REFERENCES Fornecedor(cnpj) ON DELETE CASCADE,
    PRIMARY KEY (idMovtoEstoque, cnpj)
);

insert into NotaFiscal (idNFe, txtXML)
   values
     (0, 'xml');

insert into Embalagem (codEmbalagem, nomEmbalagem, qtdCapacidade)
   values
   (1, 'Frasco de 1 litro', 1000);

insert into Produto (nomProduto, nomLista, perPureza, vlrDensidade, idtAtivo)
    values
         ('1,2-DICLOROETANO', 'Lista II', 99.99, 1.30, true),
         ('ACETATO DE ETILA', 'Lista II', 99.80, 0.90, true),
         ('ACETONA', 'Lista II', 9.50, 0.79, true),
         ( 'ÁCIDO ACÉTICO', 'Lista IV', 99.70, 1.05, true),
         ('ÁCIDO BENZÓICO', 'Lista IV', 99.50, 1.27, true),
         ( 'ÁCIDO BÓRICO e seus sais', 'Lista IV', 99.50, 1.44, true),
         ( 'ÁCIDO BROMÍDRICO', 'Lista IV', 48.00, 1.49, true),
         ( 'ÁCIDO CLORÍDRICO (37%)', 'Lista IV', 37.00, 1.19, true),
         ('ÁCIDO CLORÍDRICO solução 0,1 N', 'Lista IV', 0.80, 1.01, true),
         ( 'ÁCIDO CLORÍDRICO solução 1,0', 'Lista IV', 86.00, 1.20, true),
         ( 'ÁCIDO FÓRMICO (98%)', 'Lista IV', 8.00, 1.01, true),
         ( 'ÁCIDO FÓRMICO (86%)', 'Lista IV', 98.00, 1.22, true),
         ( 'ÁCIDO SULFÚRICO', 'Lista IV', 98.00, 1.83, true),
         ( 'ANIDO ACÉTICO', 'Lista VI', 99.00, 1.08, true),
         ( 'BICARBONATO DE POTÁSSIO', 'Lista V', 100.00, 2.17, true),
         ( 'SAFROL', 'Lista I', 97.00, 1.10, true),
         ( '2, 2 DICLORO-DIETIL-METILAMINA (HN-2)', 'EXÉRCITO', null, null, true),
         ( 'ÁCIDO BENZÍLICO (ÁCIDO-ALFA-HIDROXI-ALFA-FENIL-BENZENOACÉTICO; ÁCIDO 2,2-DIFENIL-2-HIDROXIACÉTICO)', 'EXÉRCITO', null, null, true),
         ( 'ÁCIDO FLUORÍDRICO (FLUORETO DE HIDROGÊNIO)', 'EXÉRCITO', null, null, true),
         ( 'TRIETANOLAMINA (TRI(2-HIDROXIETIL) AMINA)', 'EXÉRCITO', null, null, true);

insert into ProdutoItem (codProduto, seqItem, idNFe, datValidade, codEmbalagem)
    values
     (1, 1, 1, '2025-12-31', 'C'),
     (1, 2, 1, '2026-12-31', 'D');

insert into OrgaoControle (codOrgaoControle, nomOrgaoControle)
     values
         ('PF', 'Polícia Federal'),
         ('EX', 'Exército'),
         ('AN', 'ANVISA');

insert into ProdutoOrgaoControle (codProduto, codOrgaoControle)
    values
         (1, 'EX'),
         (1, 'PF');

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

insert into LocalEstocagem (codCampus, codUnidade, codPredio, codLaboratorio, nomLocal, codSiapeResponsavel)
    values
     ('NG', '11.56.12', '17', '101', 'Laboratório de Química', '2418912'),
     ('NS', '11.55.11', '01', '001', 'COORDENAÇÃO DE DESENVOLVIMENTO DA INFRAESTRUTURA DE PESQUISA', '2418912'),
     ('NS', '11.55.11', '11', '102', 'DEPARTAMENTO DE CIÊNCIAS BIOLÓGICAS', '1045235'),
     ('NP', '11.62.05', '20', '051', 'DEPARTAMENTO DE COMPUTAÇÃO E MECÂNICA', '16760510'),
     ('NS', '11.55.11', '11', '141', 'DEPARTAMENTO DE CIÊNCIA E TECNOLOGIA AMBIENTAL', '2092847');

insert into MovtoEstoque 
    (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
values
   (1, 1, 'NG', '11.56.12', '17', '101', '2024-12-31', 'IM', 100, 'Implantação'),
   (1, 1, 'NG', '11.56.12', '17', '101', '2025-01-01', 'IN', 80, 'Inventario'),
   (1, 1, 'NG', '11.56.12', '17', '101', '2025-01-01', 'AC', -20, 'Ajuste Saida'),
   (1, 1, 'NG', '11.56.12', '17', '101', '2025-01-05', 'EC', 200, 'Implantação'),
   (1, 1, 'NG', '11.56.12', '17', '101', '2025-01-05', 'ED', 30, 'Implantação');


DO $$
DECLARE
    token_usuario_1 TEXT;
    token_usuario_2 TEXT;
BEGIN
    -- Buscar token do primeiro usuário
    SELECT token INTO token_usuario_1
    FROM usuario
    WHERE cpf = '123.456.789-01';

    -- Buscar token do usuário administrador
    SELECT token INTO token_usuario_2
    FROM usuario
    WHERE cpf = '333.333.333-33';

    -- Verificar se os tokens foram encontrados
    IF token_usuario_1 IS NULL THEN
        RAISE EXCEPTION 'Token não encontrado para o CPF 123.456.789-01';
    END IF;

    IF token_usuario_2 IS NULL THEN
        RAISE EXCEPTION 'Token não encontrado para o CPF 333.333.333-33';
    END IF;

    -- Associar usuário 1 com laboratórios específicos
    INSERT INTO usuariolocalestocagem (token, codCampus, codUnidade, codPredio, codLaboratorio)
    VALUES
    (token_usuario_1, 'NG', '11.56.12', '17', '101'), 
    (token_usuario_1, 'NS', '11.55.11', '01', '001'); 

    -- Associar usuário administrador com todos os laboratórios
    INSERT INTO usuariolocalestocagem (token, codCampus, codUnidade, codPredio, codLaboratorio)
    SELECT token_usuario_2, codCampus, codUnidade, codPredio, codLaboratorio
    FROM localestocagem;
END $$;

--  TS transferencia saida
--  IN inventario

--  AE Ajuste entrada --> Falta de registrro entrada NFe/Doacao
--  AC ajuste consumo
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
Alter table MovtoEstoque add foreign key (codCampus, codUnidade)
       references UnidadeOrganizacional (codCampus, codUnidade);

Alter table MovtoEstoque add foreign key (codProduto, seqItem)
       references ProdutoItem (codProduto, seqItem);
Alter table MovtoEstoque add foreign key 
            (codCampus, codUnidade, codPredio, codLaboratorio)
       references LocalEstocagem 
            (codCampus, codUnidade, codPredio, codLaboratorio);


-- Trigger
CREATE OR REPLACE FUNCTION trg_set_seqItem()
RETURNS TRIGGER AS $$
DECLARE
    max_seq smallint;
BEGIN
    -- Obt�m o maior seqItem para o codProduto fornecido
    SELECT COALESCE(MAX(seqItem), 0) INTO max_seq
    FROM ProdutoItem
    WHERE codProduto = NEW.codProduto;

    -- Define o seqItem como o maior encontrado + 1
    NEW.seqItem := max_seq + 1;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


