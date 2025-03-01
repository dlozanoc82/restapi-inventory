import dayjs from "dayjs";

export function formatearFecha(fecha) {
    return dayjs(fecha).format('DD/MM/YYYY');
}