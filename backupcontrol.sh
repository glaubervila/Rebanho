#!/bin/bash

programa="Cronos Rebanho"

date=$(date +"%Y-%m-%d")

log_file="/var/log/backupcontrol_rebanho-${date}.log"

path_bck="/root/backup"
path_bck2="/root/particao_backup"

sql_file="/tmp/cronos-rebanho_bck_${date}.sql"

zip_file="${path_bck}/cronos-rebanho_bck_${date}.zip"
zip_file2="${path_bck2}/rebanho/cronos-rebanho_bck_${date}.zip"

emails="gverdebackup@gmail.com,mmagropec.servidor@gmail.com"

#Conexao Mysql
user="root"
db="rebanho"
pass="q1w2e3r4"

# ----------- Funcoes -----------

function LogMsg(){

    DATA=$(date +"%Y-%m-%d %H:%M:%S")
    echo ${DATA} $1 | tee -a ${log_file}

}

# Logando
LogMsg "============< $(date +"%d-%m-%Y") >============"
LogMsg "Iniciando Programa[ ${programa} ]  Pid[ $$ ]"
LogMsg "Arquivo de BackUp [${path_bck}]"
LogMsg "Arquivo de SQL    [${sql_file}]"
LogMsg "Arquivo Zip       [${zip_file}]"


# Mysql Dump
LogMsg "Executando MysqlDump"
mysqldump -u $user -p$pass $db > $sql_file

# LogMsg "Verifica se o Arquivo Existe"
if [ -r $sql_file ]; then

    LogMsg "Gerando Arquivo Zip"

    zip -r9 $zip_file $sql_file
    zip -r9 $zip_file2 $sql_file

#    LogMsg "Verifica se o Arquivo Zip Existe"
    if [ -r $zip_file ]; then

        LogMsg "Arquivo Zip Gerado com Sucesso"

        LogMsg "Apagando Arquivo Temporario"
        rm -f $sql_file

        chmod -R 777 $zip_file2
	
	LogMsg "Enviando Notificacao"
    else
        LogMsg "[ ERROR ] Arquivo de Zip Nao Foi Gerado"
        mutt -s "Backup [ ERROR ] ${programa} - ${date}"  -- $emails < ${log_file}
        exit
    fi

else
    LogMsg "[ ERROR ] Arquivo de Dump Nao Foi Gerado"
    mutt -s "Backup [ ERROR ] ${programa} - ${date}"  -- $emails < ${log_file}
    exit
fi

LogMsg "BackUp Gerado Com Sucesso!"

mutt -s "Backup ${programa} - ${date}" -a $zip_file2 -- $emails < ${log_file}

exit
