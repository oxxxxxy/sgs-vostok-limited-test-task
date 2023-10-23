-- общий вид таблицы сотрудники, т.к. судя по данным они стоят во главе.

CREATE TABLE emploees (
	id		BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	,city		VARCHAR(256)
	,plantShop		VARCHAR(256)
	,brigade		VARCHAR(256)
	,workFrom		VARCHAR(2)
	,workUntil		VARCHAR(2)
	,emploee		VARCHAR(256)
)

-- однако, я бы разделил её на отдельные таблицы и потом бы соединял через join'ы при селекте
-- или сделал бы view, к которому уже обращался
-- а при инсерте наследовал бы id друг в друга
-- опять таки, опыта у меня мало, возможно, это не лучшее решение по производительности

CREATE TABLE cities (
	id		BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	,city		VARCHAR(256)
)

CREATE TABLE plantShops (
	id		BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	,city_id		BIGINT								-- наследуем id из таблицы cities
	,plantShop		VARCHAR(256)
)

CREATE TABLE brigades (
	id		BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	,plantShop_id		BIGINT						-- наследуем id из таблицы plantShops
	,brigade		VARCHAR(256)
	,workFrom		SMALLINT
	,workUntil	SMALLINT
)

CREATE TABLE emploees (
	id		BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY
	,brigade_id		BIGINT							-- наследуем id из таблицы brigades
	,first_name		VARCHAR(128)
	,last_name		VARCHAR(128)
	,middle_name	VARCHAR(128)
)

