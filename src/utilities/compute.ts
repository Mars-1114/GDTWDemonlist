export function getPoints(placement: number, aredl_placement: number, list_len: number) {
    let scale = 149 / (list_len - 1) * (placement - 1) + 1;
    let bonus = Math.max((401 - aredl_placement) / 400 * 250, 0);
    return 2176.2 * (1 + Math.log((scale + 7) / 8)) / ((scale + 7) * Math.pow(1.0881, Math.pow(scale, 0.6))) + bonus;
}