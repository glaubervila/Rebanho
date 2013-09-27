#!/bin/bash

programa="Rebanho BackUpControl"

log_file="/var/log/backupcontrol_rebanho.log"

date=$(date +"%Y-%m-%d")

path_bck="/root/backup"

sql_file="/tmp/cronos-rebanho_bck_${date}.sql"

#Arquivo de BackUp Local
zip_file="${path_bck}/cronos-rebanho_bck_${date}.zip"
#Arquivo de BackUp Hd2
zip_file2="/media/BackUp/cronos/cronos-rebanho_db_${date}.zip"

#Conexao Mysql
user="root"
pass="q1w2e3r4"
db="mmagropec"

# ----------- Funcoes -----------

function LogMsg(){

    DATA=$(date +"%Y-%m-%d %H:%M:%S")
    echo ${DATA} $1 | tee -a ${log_file}

}

# Logando
LogMsg "===========================< $(date +"%d-%m-%Y") >==========================="
LogMsg "Iniciando Programa[ ${programa} ]  Pid[ $$ ]"
LogMsg "Arquivo de BackUp [${path_bck}]"
LogMsg "Arquivo de SQL    [${sql_file}]"
LogMsg "Arquivo Zip       [${zip_file}]"


# Mysql Dump
LogMsg "Executando MysqlDump"
mysqldump -u $user -p$pass $db > $sql_file

LogMsg "Verifica se o Arquivo Existe"
if [ -r $sql_file ]; then

    LogMsg "Gerando Arquivo Zip"
    zip -r9 $zip_file $sql_file

    LogMsg "Verifica se o Arquivo Zip Existe"
    if [ -r $zip_file ]; then

        LogMsg "Arquivo Zip Gerado com Sucesso"

        LogMsg "Apagando Arquivo Temporario"
        rm -f $sql_file

	LogMsg "Copiando Zip para Hd2"
	cp $zip_file $zip_file2

    else
        LogMsg "[ ERROR ] Arquivo de Zip Nao Foi Gerado"
        exit
    fi

else
    LogMsg "[ ERROR ] Arquivo de Dump Nao Foi Gerado"
    exit
fi

LogMsg "BackUp Gerado Com Sucesso!"
exit
