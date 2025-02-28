create table Usuario (
    codSiape int not null,
    nomUsuario char(50) not null,
    idtTipoUsuario char(1) not null,
    primary  key (codSiape)
);  

create table NotaFiscal (
   idNFe serial not null,
   txtXML text not null,
   primary key (idNFe)
);

create table Embalagem (
    codEmbalagem smallint not null,
    nomEmbalagem varchar(30) not null,
    qtdCapacidade decimal (7,3) not null,
    primary key (codEmbalagem)
);

create table Produto (
   codProduto int not null,
   nomProduto varchar(128) not null,
   nomLista varchar(15) not null,
   perPureza decimal (5,2),
   vlrDensidade decimal  (5,2),
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

-- Dependencia hierarquica com Departamento
create table LocalEstocagem (
    codCampus char(2) not null, 
    codUnidade  char(8) not null,
    codPredio char(2) not null,
    codLaboratorio  char(3) not null,
    nomLocal varchar(60) not null,
    codSiapeResponsavel int not null,
    primary key (codCampus, codUnidade, codPredio, codLaboratorio)
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

INSERT INTO Usuario (codSiape, nomUsuario, idtTipoUsuario)
VALUES
    (2418912, 'JÉSSICA OLIVEIRA SILVA', 'S'),
    (1045235, 'THIAGO COTTA RIBEIRO', 'S'),
    (16760510, 'RENATA BARBOSA DE OLIVEIRA', 'S'),
    (2092847, 'FREDERICO KEIZO ODAN', 'S'),
    (2152427, 'TAIZA DE PINHO BARROSO LUCAS', 'S'),
    (2762193, 'KARLA DE SOUZA TORRES', 'S'),
    (1218039, 'RUBENS MARCOS DOS SANTOS FILHO', 'S'),
    (2828733, 'RENATA CALCIOLARI', 'S'),
    (1106409, 'WESLEI PATRICK TEODÓSIO SOUSA', 'S'),
    (392206, 'MARCIO SILVA BASILIO', 'S'),
    (1523341, 'RENATO GUIMARAES RIBEIRO', 'S'),
    (1221943, 'JOSIMAR DOS REIS DE SOUZA', 'S'),
    (1996197, 'ELTON JOSE DA SILVA JUNIOR', 'S'),
    (2891590, 'ALBA VALERIA APARECIDA DURAES', 'S'),
    (1859867, 'SABRINA ANACLETO TEIXEIRA', 'S'),
    (2146290, 'LUCAS GUEDES VILAS BOAS', 'S'),
    (1671374, 'NILTON CESAR DA SILVA', 'S'),
    (3063139, 'FABIO DE SAO JOSE', 'S'),
    (1550416, 'RONEY ANDERSON NASCIMENTO DE AQUINO', 'S'),
    (2084859, 'PETER LUDVIG', 'S'),
    (2343407, 'URSULA DO CARMO RESENDE', 'S'),
    (1805736, 'PRISCILA PEREIRA SILVA CALDEIRA', 'S'),
    (1822097, 'RAQUEL VIEIRA MAMBRINI', 'S');


insert into NotaFiscal (idNFe, txtXML)
   values
     (0, 'xml');

insert into Embalagem (codEmbalagem, nomEmbalagem, qtdCapacidade)
   values
   (1, 'Frasco de 1 litro', 1000);
   
insert into Produto (codProduto, nomProduto, nomLista, perPureza, vlrDensidade)
  values
     (1, '1,2-DICLOROETANO', 'Lista II', 99.99, 1.30),
     (2, 'ACETATO DE ETILA', 'Lista II', 99.80, 0.90),
     (3, 'ACETONA', 'Lista II', 9.50, 0.79),
     (4, 'ÁCIDO ACÉTICO', 'Lista IV', 99.70, 1.05),
     (5, 'ÁCIDO BENZÓICO', 'Lista IV', 99.50, 1.27),
     (6, 'ÁCIDO BÓRICO e seus sais', 'Lista IV', 99.50, 1.44),
     (7, 'ÁCIDO BROMÍDRICO', 'Lista IV', 48.00, 1.49),
     (8, 'ÁCIDO CLORÍDRICO (37%)', 'Lista IV', 37.00, 1.19),
     (9, 'ÁCIDO CLORÍDRICO solução 0,1 N', 'Lista IV', 0.80, 1.01),
     (10, 'ÁCIDO CLORÍDRICO solução 1,0', 'Lista IV', 86.00, 1.20),
     (12, 'ÁCIDO FÓRMICO (98%)', 'Lista IV', 8.00, 1.01),
     (11, 'ÁCIDO FÓRMICO (86%)', 'Lista IV', 98.00, 1.22),
     (13, 'ÁCIDO SULFÚRICO', 'Lista IV', 98.00, 1.83),
     (14, 'ANIDO ACÉTICO', 'Lista VI', 99.00, 1.08),
     (15, 'BICARBONATO DE POTÁSSIO', 'Lista V', 100.00, 2.17),
     (40, 'SAFROL', 'Lista I', 97.00, 1.10),
     (43, '2, 2 DICLORO-DIETIL-METILAMINA (HN-2)', 'EXÉRCITO', null, null),			
     (44, 'ÁCIDO BENZÍLICO (ÁCIDO-ALFA-HIDROXI-ALFA-FENIL-BENZENOACÉTICO; ÁCIDO 2,2-DIFENIL-2-HIDROXIACÉTICO)', 'EXÉRCITO', null, null),			
     (45, 'ÁCIDO FLUORÍDRICO (FLUORETO DE HIDROGÊNIO)', 'EXÉRCITO', null, null),			
     (69, 'TRIETANOLAMINA (TRI(2-HIDROXIETIL) AMINA)', 'EXÉRCITO', null, null);

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
    ('NG', '11.56.12', '17', '101', 'Laboratório de Química', '2418912');

insert into MovtoEstoque
   (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
 values
   (1, 1, 'NG', '11.56.12', '17', '101', '31-12-2024', 'IM', 100, 'Implantação'),
   (1, 1, 'NG', '11.56.12', '17', '101', '01-01-2025', 'IN', 80, 'Inventario'),
   (1, 1, 'NG', '11.56.12', '17', '101', '01-01-2025', 'AC', -20, 'Ajuste Saida'),
   (1, 1, 'NG', '11.56.12', '17', '101', '05-01-2025', 'EC', 200, 'Implantação'),
   (1, 1, 'NG', '11.56.12', '17', '101', '05-01-2025', 'ED', 30, 'Implantação');
   

    EC entrada compra
--  ED entrada doacao
--  TE transferencia entrada
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


