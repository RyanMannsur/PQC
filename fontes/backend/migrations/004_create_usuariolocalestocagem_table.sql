CREATE TABLE IF NOT EXISTS usuariolocalestocagem (
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