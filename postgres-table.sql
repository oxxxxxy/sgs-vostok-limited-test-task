

-- общий вид таблицы сотрудники, т.к. судя по данным они стоят во главе.

CREATE TABLE emploees (
	id		BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	,city		VARCHAR(256)	NOT NULL
	,plantShop		VARCHAR(256)	NOT NULL
	,brigade		VARCHAR(256)	NOT NULL
	,workFrom		SMALLINT	NOT NULL
	,workUntil	SMALLINT	NOT NULL
	,emploee		VARCHAR(256)	NOT NULL
)

-- однако, я бы разделил её на отдельные таблицы и потом бы соединял через join'ы при селекте
-- или сделал бы view, к которому уже обращался
-- а при инсерте наследовал бы id друг в друга
-- опять таки, опыта у меня мало, возможно, это не лучшее решение по производительности

CREATE TABLE cities (
	id		BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	,city		VARCHAR(256)	NOT NULL
)

CREATE TABLE plantShops (
	id		BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	,city_id		BIGINT	NOT NULL								-- наследуем id из таблицы cities
	,plantShop		VARCHAR(256)	NOT NULL
)

CREATE TABLE brigades (
	id		BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	,plantShop_id		BIGINT	NOT NULL						-- наследуем id из таблицы plantShops
	,brigade		VARCHAR(256)	NOT NULL
	,workFrom		SMALLINT	NOT NULL
	,workUntil	SMALLINT	NOT NULL
)

CREATE TABLE emploees (
	id		BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	,brigade_id		BIGINT	NOT NULL							-- наследуем id из таблицы brigades
	,first_name		VARCHAR(128) 	NOT NULL
	,last_name		VARCHAR(128) 	NOT NULL
	,middle_name	VARCHAR(128)
)

